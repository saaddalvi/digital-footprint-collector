'use client';

import { useState } from 'react';
import UsernameResults from '@/components/results/UsernameResults';
import EmailResults from '@/components/results/EmailResults';
import NameResults from '@/components/results/NameResults';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import Card from '@/components/ui/Card';
import LoadingProgress from '@/components/ui/LoadingProgress';
import ExportButton from '@/components/ui/ExportButton';
import PDFExportButton from '@/components/ui/PDFExportButton';

interface SearchResult {
  query: string;
  type: string;
  results: any;
  timestamp: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchType, setSearchType] = useState<'username' | 'email' | 'name'>('username');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const backendUrl = 'http://localhost:8000';
      
      let body;
      if (searchType === 'name') {
        if (!firstName.trim() || !lastName.trim()) {
          throw new Error('Please enter both first and last name');
        }
        body = {
          type: searchType,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          query: null
        };
      } else {
        if (!searchQuery.trim()) {
          throw new Error(`Please enter a ${searchType}`);
        }
        body = {
          type: searchType,
          query: searchQuery.trim(),
          first_name: null,
          last_name: null
        };
      }
      
      console.log('Sending request:', body);
      
      const response = await fetch(`${backendUrl}/api/osint/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.detail || 'Search failed');
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      setResults(data);
    } catch (err) {
      console.error('Request error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    if (results.type === 'username') {
      return (
        <UsernameResults
          socialMedia={results.results.social_media || []}
          totalFound={results.results.total_found || 0}
        />
      );
    }

    if (results.type === 'email') {
      return (
        <EmailResults
          email={results.results.email}
          username={results.results.username}
          domain={results.results.domain}
          provider={results.results.provider}
          domainInfo={results.results.domain_information || {}}
          socialAccounts={results.results.social_media_accounts || []}
          totalSocialAccounts={results.results.total_social_accounts || 0}
          note={results.results.note}
        />
      );
    }

    if (results.type === 'name') {
      return (
        <NameResults
          firstName={results.results.first_name || ''}
          lastName={results.results.last_name || ''}
          fullName={results.results.full_name || ''}
          usernameVariations={results.results.username_variations || []}
          socialProfiles={results.results.social_profiles || []}
          professionalProfiles={results.results.professional_profiles || []}
          publicRecords={results.results.public_records}
          groupedProfiles={results.results.grouped_profiles}
          totalProfilesFound={results.results.total_profiles_found || 0}
          searchQueries={results.results.search_queries || []}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] -top-48 -left-48 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute w-[500px] h-[500px] -top-48 -right-48 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute w-[500px] h-[500px] bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-violet-500/30 to-pink-500/30 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 pt-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Digital Footprint Collector
            </h1>
            <p className="text-lg text-gray-400">
              Discover comprehensive online presence across the web
            </p>
          </div>

          {/* Search Form */}
          <Card className="p-6 mb-6">
            <form onSubmit={handleSearch} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">
                  Search Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['username', 'email', 'name'] as const).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      onClick={() => {
                        setSearchType(type);
                        setError(null);
                      }}
                      variant={searchType === type ? 'primary' : 'secondary'}
                      className="w-full py-2.5"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {searchType === 'name' ? (
                <div className="space-y-4">
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g., John"
                    label="First Name"
                    required
                  />
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g., Doe"
                    label="Last Name"
                    required
                  />
                </div>
              ) : (
                <Input
                  type={searchType === 'email' ? 'email' : 'text'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Enter ${searchType}...`}
                  label={searchType === 'username' ? 'Username' : 'Email Address'}
                  required
                />
              )}

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full"
              >
                {!loading && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                <span>{loading ? 'Searching...' : 'Search Digital Footprint'}</span>
              </Button>
            </form>
          </Card>

          {/* Loading Indicator */}
          {loading && (
            <Card className="p-6 mb-6">
              <LoadingProgress message={`Searching for ${searchType}...`} />
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="error" className="mb-6 animate-shake">
              {error}
            </Alert>
          )}

          {/* Results */}
          {results && (
            <Card className="p-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Search Results</h2>
                    <p className="text-sm text-gray-400">
                      Query: <span className="text-indigo-400 font-medium">{results.query}</span>
                    </p>
                  </div>
                </div>
                
                {/* Export Buttons */}
                <div className="flex gap-2">
                  <ExportButton 
                    data={results} 
                    filename={`dfc_${results.type}_${results.query.replace(/[^a-z0-9]/gi, '_')}`}
                  />
                  <PDFExportButton data={results} />
                </div>
              </div>

              {renderResults()}

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                <span>Type: <span className="text-indigo-400 font-medium">{results.type}</span></span>
                <span>{new Date(results.timestamp).toLocaleString()}</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}