import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

interface Platform {
  platform: string;
  url: string;
  found: boolean;
  status_code?: number;
  error?: string;
}

interface UsernameResultsProps {
  socialMedia: Platform[];
  totalFound: number;
}

export default function UsernameResults({ socialMedia, totalFound }: UsernameResultsProps) {
  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card variant="info" className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Found on {totalFound} platforms</h3>
            <p className="text-sm text-gray-300">Out of {socialMedia.length} platforms searched</p>
          </div>
          <div className="text-3xl font-bold text-indigo-400">{totalFound}</div>
        </div>
      </Card>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {socialMedia.map((platform, index) => (
          <Card 
            key={index} 
            variant={platform.found ? 'success' : 'error'}
            hover
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-white font-semibold capitalize">{platform.platform}</span>
                  <Badge variant={platform.found ? 'success' : 'error'}>
                    {platform.found ? 'Found' : 'Not Found'}
                  </Badge>
                </div>
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-indigo-400 break-all"
                >
                  {platform.url}
                </a>
                {platform.error && (
                  <p className="text-xs text-red-400 mt-1">Error: {platform.error}</p>
                )}
              </div>
              {platform.found && (
                <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}