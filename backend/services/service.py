import aiohttp
import asyncio
from typing import Dict, List
import re
import whois
from datetime import datetime
from urllib.parse import quote_plus

class OSINTService:
    """
    Service to handle OSINT data collection
    """
    
    def __init__(self): 
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    
    def _format_date(self, date_obj) -> str:
        """
        Format datetime object to readable string
        """
        try:
            if isinstance(date_obj, list):
                # If it's a list, take the first date
                date_obj = date_obj[0]
            
            if isinstance(date_obj, datetime):
                return date_obj.strftime('%B %d, %Y')  # e.g., "August 13, 1995"
            
            return str(date_obj)
        except:
            return 'N/A'
    
    async def search_username(self, username: str) -> Dict:
        """
        Search for username across multiple platforms
        """
        platforms = {
            'github': f'https://github.com/{username}',
            'twitter': f'https://twitter.com/{username}',
            'instagram': f'https://instagram.com/{username}',
            'reddit': f'https://reddit.com/user/{username}',
            'linkedin': f'https://linkedin.com/in/{username}',
            'medium': f'https://medium.com/@{username}',
            'dev.to': f'https://dev.to/{username}',
            'codepen': f'https://codepen.io/{username}',
            'pinterest': f'https://pinterest.com/{username}',
            'youtube': f'https://youtube.com/@{username}',
            'tiktok': f'https://tiktok.com/@{username}',
            'twitch': f'https://twitch.tv/{username}',
            'dribbble': f'https://dribbble.com/{username}',
            'behance': f'https://behance.net/{username}',
        }
        
        results = []
        
        async with aiohttp.ClientSession() as session:
            tasks = []
            for platform, url in platforms.items():
                tasks.append(self._check_url(session, platform, url))
            
            results = await asyncio.gather(*tasks)
        
        return {
            'social_media': [r for r in results if r is not None],
            'total_found': len([r for r in results if r and r.get('found')])
        }
    
    async def _check_url(self, session: aiohttp.ClientSession, platform: str, url: str) -> Dict:
        """
        Check if a URL exists
        """
        try:
            async with session.get(url, headers=self.headers, timeout=aiohttp.ClientTimeout(total=5), allow_redirects=True) as response:
                found = response.status == 200
                return {
                    'platform': platform,
                    'url': url,
                    'found': found,
                    'status_code': response.status
                }
        except asyncio.TimeoutError:
            return {
                'platform': platform,
                'url': url,
                'found': False,
                'error': 'Timeout'
            }
        except Exception as e:
            return {
                'platform': platform,
                'url': url,
                'found': False,
                'error': str(type(e).__name__)
            }
    
    async def search_email(self, email: str) -> Dict:
        """
        Comprehensive email OSINT search (without HIBP)
        """
        # Basic email validation
        if '@' not in email or not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            return {'error': 'Invalid email format'}
        
        username, domain = email.split('@')
        
        # Check if email is from common providers
        common_providers = {
            'gmail.com': 'Google Gmail',
            'yahoo.com': 'Yahoo Mail',
            'outlook.com': 'Microsoft Outlook',
            'hotmail.com': 'Microsoft Hotmail',
            'icloud.com': 'Apple iCloud',
            'protonmail.com': 'ProtonMail',
        }
        
        provider_info = common_providers.get(domain, 'Custom Domain' if domain not in common_providers else 'Unknown Provider')
        
        # Run checks concurrently
        domain_info_task = self._get_domain_info(domain)
        social_media_task = self._check_social_media_email(username)
        
        domain_info, social_accounts = await asyncio.gather(
            domain_info_task, 
            social_media_task
        )
        
        return {
            'email': email,
            'username': username,
            'domain': domain,
            'provider': provider_info,
            'domain_information': domain_info,
            'social_media_accounts': social_accounts,
            'total_social_accounts': len([s for s in social_accounts if s.get('found')]) if social_accounts else 0,
            'note': 'Data breach checking requires an API key. Use https://haveibeenpwned.com to check manually.'
        }
    
    async def _get_domain_info(self, domain: str) -> Dict:
        """
        Get WHOIS information for domain
        """
        try:
            loop = asyncio.get_event_loop()
            domain_data = await loop.run_in_executor(None, whois.whois, domain)
            
            if domain_data:
                return {
                    'domain_name': str(domain_data.domain_name[0]) if isinstance(domain_data.domain_name, list) else str(domain_data.domain_name) if hasattr(domain_data, 'domain_name') else domain,
                    'registrar': domain_data.registrar if hasattr(domain_data, 'registrar') else 'N/A',
                    'creation_date': self._format_date(domain_data.creation_date) if hasattr(domain_data, 'creation_date') else 'N/A',
                    'expiration_date': self._format_date(domain_data.expiration_date) if hasattr(domain_data, 'expiration_date') else 'N/A',
                    'name_servers': domain_data.name_servers if hasattr(domain_data, 'name_servers') else [],
                    'status': domain_data.status[0] if isinstance(domain_data.status, list) and hasattr(domain_data, 'status') else domain_data.status if hasattr(domain_data, 'status') else 'N/A',
                    'emails': domain_data.emails if hasattr(domain_data, 'emails') else [],
                    'organization': domain_data.org if hasattr(domain_data, 'org') else 'N/A'
                }
            return {'error': 'No WHOIS data available'}
        except Exception as e:
            return {
                'error': f'Could not retrieve WHOIS data: {str(e)}',
                'note': 'This is common for major email providers (Gmail, Yahoo, etc.)'
            }
    
    async def _check_social_media_email(self, username: str) -> List[Dict]:
        """
        Check social media platforms for accounts using email username
        """
        platforms = {
            'github': f'https://github.com/{username}',
            'reddit': f'https://reddit.com/user/{username}',
            'medium': f'https://medium.com/@{username}',
        }
        
        async with aiohttp.ClientSession() as session:
            tasks = []
            for platform, url in platforms.items():
                tasks.append(self._check_url(session, platform, url))
            
            results = await asyncio.gather(*tasks)
            return [r for r in results if r is not None]
    
    async def search_name(self, first_name: str, last_name: str) -> Dict:
        """
        Comprehensive name-based OSINT search
        """
        full_name = f"{first_name} {last_name}".strip()
        
        # Generate username variations
        first = first_name.lower()
        last = last_name.lower()
        
        username_variations = [
            f"{first}{last}",
            f"{first}.{last}",
            f"{first}_{last}",
            f"{first}-{last}",
            f"{first[0]}{last}",
            f"{first}{last[0]}",
            f"{last}{first}",
            f"{last}.{first}",
        ]
        
        username_variations = list(set(username_variations))
        
        social_profiles_task = self._search_social_profiles(username_variations)
        professional_profiles_task = self._search_professional_profiles(username_variations, full_name)
        public_records_task = self._search_public_records(full_name)
        
        social_profiles, professional_profiles, public_records = await asyncio.gather(
            social_profiles_task,
            professional_profiles_task,
            public_records_task
        )
        
        all_profiles = social_profiles + professional_profiles
        grouped_profiles = self._group_profiles_by_confidence(all_profiles, full_name)
        
        return {
            'first_name': first_name,
            'last_name': last_name,
            'full_name': full_name,
            'username_variations': username_variations[:8],
            'social_profiles': social_profiles,
            'professional_profiles': professional_profiles,
            'public_records': public_records,
            'grouped_profiles': grouped_profiles,
            'total_profiles_found': len(all_profiles),
            'search_queries': self._generate_search_queries(full_name)
        }
    
    async def _search_social_profiles(self, username_variations: List[str]) -> List[Dict]:
        """
        Search social media platforms for profiles
        """
        platforms = {
            'facebook': 'https://facebook.com/{}',
            'twitter': 'https://twitter.com/{}',
            'instagram': 'https://instagram.com/{}',
            'reddit': 'https://reddit.com/user/{}',
            'tiktok': 'https://tiktok.com/@{}',
            'pinterest': 'https://pinterest.com/{}',
        }
        
        found_profiles = []
        
        async with aiohttp.ClientSession() as session:
            for variation in username_variations[:3]:
                tasks = []
                for platform, url_template in platforms.items():
                    url = url_template.format(variation)
                    tasks.append(self._check_profile_with_metadata(session, platform, url, variation))
                
                results = await asyncio.gather(*tasks)
                found_profiles.extend([r for r in results if r and r.get('found')])
        
        return found_profiles
    
    async def _search_professional_profiles(self, username_variations: List[str], full_name: str) -> List[Dict]:
        """
        Search professional platforms
        """
        platforms = {
            'linkedin': 'https://linkedin.com/in/{}',
            'github': 'https://github.com/{}',
            'stackoverflow': 'https://stackoverflow.com/users/{}',
        }
        
        found_profiles = []
        
        async with aiohttp.ClientSession() as session:
            for variation in username_variations[:3]:
                tasks = []
                for platform, url_template in platforms.items():
                    url = url_template.format(variation)
                    tasks.append(self._check_profile_with_metadata(session, platform, url, variation))
                
                results = await asyncio.gather(*tasks)
                found_profiles.extend([r for r in results if r and r.get('found')])
        
        return found_profiles
    
    async def _check_profile_with_metadata(self, session: aiohttp.ClientSession, platform: str, url: str, username: str) -> Dict:
        """
        Check profile and extract metadata
        """
        try:
            async with session.get(url, headers=self.headers, timeout=aiohttp.ClientTimeout(total=5), allow_redirects=True) as response:
                found = response.status == 200
                
                if found:
                    return {
                        'platform': platform,
                        'url': url,
                        'username': username,
                        'found': True,
                        'status_code': response.status,
                        'type': 'professional' if platform in ['linkedin', 'github', 'stackoverflow'] else 'social'
                    }
                return None
        except:
            return None
    
    async def _search_public_records(self, full_name: str) -> Dict:
        """
        Generate search queries for public records and mentions
        """
        encoded_name = quote_plus(full_name)
        
        return {
            'google_search': f'https://www.google.com/search?q="{full_name}"',
            'news_search': f'https://news.google.com/search?q="{full_name}"',
            'pdf_documents': f'https://www.google.com/search?q="{full_name}"+filetype:pdf',
            'linkedin_search': f'https://www.google.com/search?q=site:linkedin.com+"{full_name}"',
            'github_search': f'https://www.google.com/search?q=site:github.com+"{full_name}"',
            'note': 'These are search query URLs. Click them to see public mentions and documents.'
        }
    
    def _group_profiles_by_confidence(self, profiles: List[Dict], full_name: str) -> Dict:
        """
        Group profiles by confidence level
        """
        high_confidence = []
        medium_confidence = []
        low_confidence = []
        
        for profile in profiles:
            if profile.get('type') == 'professional':
                high_confidence.append(profile)
            elif profile.get('found'):
                medium_confidence.append(profile)
            else:
                low_confidence.append(profile)
        
        return {
            'high_confidence': high_confidence,
            'medium_confidence': medium_confidence,
            'low_confidence': low_confidence,
            'note': 'Profiles are grouped by likelihood of belonging to the same person. Professional profiles have higher confidence.'
        }
    
    def _generate_search_queries(self, full_name: str) -> List[Dict]:
        """
        Generate useful search queries for manual investigation
        """
        encoded_name = quote_plus(full_name)
        
        return [
            {
                'type': 'General Search',
                'query': f'"{full_name}"',
                'url': f'https://www.google.com/search?q="{encoded_name}"',
                'description': 'General web search for the name'
            },
            {
                'type': 'News Articles',
                'query': f'"{full_name}" news',
                'url': f'https://news.google.com/search?q="{encoded_name}"',
                'description': 'Search for news mentions'
            },
            {
                'type': 'Academic Papers',
                'query': f'"{full_name}" filetype:pdf',
                'url': f'https://www.google.com/search?q="{encoded_name}"+filetype:pdf',
                'description': 'Search for PDF documents and papers'
            },
            {
                'type': 'Professional',
                'query': f'site:linkedin.com "{full_name}"',
                'url': f'https://www.google.com/search?q=site:linkedin.com+"{encoded_name}"',
                'description': 'LinkedIn profiles'
            },
            {
                'type': 'Social Media',
                'query': f'site:twitter.com OR site:facebook.com "{full_name}"',
                'url': f'https://www.google.com/search?q=site:twitter.com+OR+site:facebook.com+"{encoded_name}"',
                'description': 'Social media profiles'
            },
            {
                'type': 'GitHub',
                'query': f'site:github.com "{full_name}"',
                'url': f'https://www.google.com/search?q=site:github.com+"{encoded_name}"',
                'description': 'GitHub repositories and contributions'
            }
        ]