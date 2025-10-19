import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Alert from '@/components/ui/Alert';
import SectionHeader from '@/components/ui/SectionHeader';

interface DomainInfo {
  domain_name?: string;
  registrar?: string;
  creation_date?: string;
  expiration_date?: string;
  name_servers?: string[];
  status?: string;
  emails?: string[];
  organization?: string;
  error?: string;
  note?: string;
}

interface SocialAccount {
  platform: string;
  url: string;
  found: boolean;
  status_code?: number;
  error?: string;
}

interface EmailResultsProps {
  email: string;
  username: string;
  domain: string;
  provider: string;
  domainInfo: DomainInfo;
  socialAccounts: SocialAccount[];
  totalSocialAccounts: number;
  note?: string;
}

export default function EmailResults({ 
  email, 
  username, 
  domain, 
  provider, 
  domainInfo, 
  socialAccounts,
  totalSocialAccounts,
  note
}: EmailResultsProps) {
  return (
    <div className="space-y-4">
      {/* Email Info Card */}
      <Card>
        <SectionHeader
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          title="Email Information"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-400">Email Address</span>
            <p className="text-white font-medium break-all">{email}</p>
          </div>
          <div>
            <span className="text-sm text-gray-400">Username</span>
            <p className="text-white font-medium">{username}</p>
          </div>
          <div>
            <span className="text-sm text-gray-400">Domain</span>
            <p className="text-white font-medium">{domain}</p>
          </div>
          <div>
            <span className="text-sm text-gray-400">Provider</span>
            <p className="text-white font-medium">{provider}</p>
          </div>
        </div>
      </Card>

      {/* Note about breach checking */}
      {note && (
        <Alert variant="info">
          {note}
        </Alert>
      )}

      {/* Domain Information */}
      <Card>
        <SectionHeader
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          }
          title="Domain Information"
        />
        {domainInfo.error ? (
          <Alert variant="warning">
            {domainInfo.error}
            {domainInfo.note && <p className="mt-2 text-sm">{domainInfo.note}</p>}
          </Alert>
        ) : (
          <div className="space-y-3">
            {domainInfo.domain_name && (
              <div>
                <span className="text-sm text-gray-400">Domain Name</span>
                <p className="text-white">{domainInfo.domain_name}</p>
              </div>
            )}
            {domainInfo.registrar && (
              <div>
                <span className="text-sm text-gray-400">Registrar</span>
                <p className="text-white">{domainInfo.registrar}</p>
              </div>
            )}
            {domainInfo.organization && domainInfo.organization !== 'N/A' && (
              <div>
                <span className="text-sm text-gray-400">Organization</span>
                <p className="text-white">{domainInfo.organization}</p>
              </div>
            )}
            {domainInfo.creation_date && domainInfo.creation_date !== 'N/A' && (
              <div>
                <span className="text-sm text-gray-400">Creation Date</span>
                <p className="text-white">{domainInfo.creation_date}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Social Media Accounts */}
      {totalSocialAccounts > 0 && (
        <Card>
          <SectionHeader
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Potential Social Media Accounts"
            subtitle={`${totalSocialAccounts} accounts found using username "${username}"`}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {socialAccounts.filter(acc => acc.found).map((account, index) => (
              <a
                key={index}
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card variant="success" hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold capitalize">{account.platform}</p>
                      <p className="text-xs text-gray-400">Click to visit →</p>
                    </div>
                    <Badge variant="success">Found</Badge>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}