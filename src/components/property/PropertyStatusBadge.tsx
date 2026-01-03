interface PropertyStatusBadgeProps {
  status: 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'REJECTED' | 'ARCHIVED';
  verificationStatus?: 'VERIFIED' | 'UNVERIFIED' | 'PENDING';
  size?: 'sm' | 'md' | 'lg';
}

export default function PropertyStatusBadge({ 
  status, 
  verificationStatus = 'UNVERIFIED', 
  size = 'md' 
}: PropertyStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'LIVE':
        if (verificationStatus === 'VERIFIED') {
          return {
            text: 'Live • Verified',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
            textColor: 'text-green-800 dark:text-green-400',
            icon: (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )
          };
        } else {
          return {
            text: 'Live',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
            textColor: 'text-blue-800 dark:text-blue-400',
            icon: (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )
          };
        }
      case 'PENDING_REVIEW':
        return {
          text: 'Under Review',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
          textColor: 'text-yellow-800 dark:text-yellow-400',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'DRAFT':
        return {
          text: 'Draft',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-800 dark:text-gray-300',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'REJECTED':
        return {
          text: 'Rejected',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          textColor: 'text-red-800 dark:text-red-400',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'ARCHIVED':
        return {
          text: 'Archived',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-600 dark:text-gray-400',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          text: 'Unknown',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          textColor: 'text-gray-800 dark:text-gray-300',
          icon: null
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className={`inline-flex items-center ${sizeClasses[size]} ${config.bgColor} ${config.textColor} rounded-full font-medium transition-colors`}>
      {config.icon && <span className="mr-1">{config.icon}</span>}
      {config.text}
    </div>
  );
}