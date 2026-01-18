'use client';

interface StatusBadgeProps {
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  className?: string;
}

export default function StatusBadge({
  status,
  className = '',
}: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Pending',
      icon: (
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    'in-progress': {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'In Progress',
      icon: (
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    completed: {
      color: 'bg-green-100 text-green-800 border-green-200',
      label: 'Completed',
      icon: (
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    rejected: {
      color: 'bg-red-100 text-red-800 border-red-200',
      label: 'Rejected',
      icon: (
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color} ${className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}
