import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import SectionHeader from '@/components/ui/SectionHeader';

interface Profile {
  platform: string;
  url: string;
  username: string;
  found: boolean;
  type: string;
}

interface GroupedProfiles {
  high_confidence: Profile[];
  medium_confidence: Profile[];
  low_confidence: Profile[];
  note: string;
}

interface SearchQuery {
  type: string;
  query: string;
  url: string;
  description: string;
}

interface PublicRecords {
  google_search: string;
  news_search: string;
  pdf_documents: string;
  linkedin_search: string;
  github_search: string;
  note: string;
}

interface NameResultsProps {
  firstName: string;
  lastName: string;
  fullName: string;
  usernameVariations: string[];
  socialProfiles: Profile[];
  professionalProfiles: Profile[];
  publicRecords?: PublicRecords;
  groupedProfiles?: GroupedProfiles;  // ✅ Add this
  totalProfilesFound: number;          // ✅ Add this
  searchQueries: SearchQuery[];        // ✅ Add this
}

export default function NameResults({ 
  firstName,
  lastName,
  fullName,
  usernameVariations, 
  socialProfiles,
  professionalProfiles,
  publicRecords,
  groupedProfiles,
  totalProfilesFound,
  searchQueries
}: NameResultsProps) {
  // Set default values if undefined
  const safeGroupedProfiles = groupedProfiles || {
    high_confidence: [],
    medium_confidence: [],
    low_confidence: [],
    note: ''
  };
  
  const safeSocialProfiles = socialProfiles || [];
  const safeProfessionalProfiles = professionalProfiles || [];
  const safeSearchQueries = searchQueries || [];

  return (
    <div className="space-y-4">
      {/* Name Info Card */}
      <Card>
        <SectionHeader
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          title="Name Search Results"
        />
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-400">First Name</span>
              <p className="text-white font-medium text-lg">{firstName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Last Name</span>
              <p className="text-white font-medium text-lg">{lastName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Total Profiles Found</span>
              <p className="text-white font-medium text-lg">{totalProfilesFound}</p>
            </div>
          </div>
          
          <div>
            <span className="text-sm text-gray-400">Username Variations Searched</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {usernameVariations.map((variation, index) => (
                <Badge key={index} variant="default" size="md">
                  {variation}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Grouped Profiles by Confidence */}
      {safeGroupedProfiles.high_confidence.length > 0 && (
        <Card variant="success">
          <SectionHeader
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="High Confidence Profiles"
            subtitle={`${safeGroupedProfiles.high_confidence.length} professional profiles found`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {safeGroupedProfiles.high_confidence.map((profile, index) => (
              <a
                key={index}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card variant="success" hover>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold capitalize">{profile.platform}</p>
                      <p className="text-xs text-gray-400">@{profile.username}</p>
                    </div>
                    <Badge variant="success">Professional</Badge>
                  </div>
                  <p className="text-xs text-indigo-400">Click to visit profile →</p>
                </Card>
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Social Profiles */}
      {safeSocialProfiles.length > 0 && (
        <Card>
          <SectionHeader
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Social Media Profiles"
            subtitle={`${safeSocialProfiles.length} social profiles found`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {safeSocialProfiles.map((profile, index) => (
              <a
                key={index}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card variant="info" hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold capitalize">{profile.platform}</p>
                      <p className="text-xs text-gray-400">@{profile.username}</p>
                    </div>
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Professional Profiles */}
      {safeProfessionalProfiles.length > 0 && (
        <Card>
          <SectionHeader
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title="Professional Profiles"
            subtitle={`${safeProfessionalProfiles.length} professional profiles found`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {safeProfessionalProfiles.map((profile, index) => (
              <a
                key={index}
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card variant="success" hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold capitalize">{profile.platform}</p>
                      <p className="text-xs text-gray-400">@{profile.username}</p>
                    </div>
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Search Queries for Further Investigation */}
      {safeSearchQueries.length > 0 && (
        <Card>
          <SectionHeader
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            title="Advanced Search Queries"
            subtitle="Click to search for public mentions and records"
          />
          <div className="space-y-2 mt-4">
            {safeSearchQueries.map((query, index) => (
              <a
                key={index}
                href={query.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card hover className="bg-white/5 border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="info" size="sm">{query.type}</Badge>
                      </div>
                      <p className="text-white text-sm font-medium mb-1">{query.description}</p>
                      <code className="text-xs text-gray-400 break-all">{query.query}</code>
                    </div>
                    <svg className="w-5 h-5 text-indigo-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Public Records Note */}
      {publicRecords?.note && (
        <Alert variant="info">
          <strong>Tip:</strong> {publicRecords.note}
        </Alert>
      )}

      {totalProfilesFound === 0 && (
        <Alert variant="warning">
          No profiles found with these username variations. The person may use different usernames or have limited online presence. Try the advanced search queries above to find public mentions.
        </Alert>
      )}
    </div>
  );
}