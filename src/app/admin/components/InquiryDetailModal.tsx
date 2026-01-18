'use client';

import { useState } from 'react';
import StatusBadge from './StatusBadge';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  jobTitle: string;
  jobDescription: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface InquiryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
  onStatusUpdate: (id: string, status: string) => void;
  onNotesUpdate: (id: string, notes: string) => void;
}

export default function InquiryDetailModal({
  isOpen,
  onClose,
  inquiry,
  onStatusUpdate,
  onNotesUpdate,
}: InquiryDetailModalProps) {
  const [adminNotes, setAdminNotes] = useState(inquiry?.adminNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !inquiry) return null;

  const handleNotesUpdate = async () => {
    if (adminNotes === inquiry.adminNotes) return;

    setIsUpdating(true);
    try {
      await onNotesUpdate(inquiry._id, adminNotes);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    onStatusUpdate(inquiry._id, newStatus);
  };

  // Extract context from job description
  const getContextOfInterest = (description: string) => {
    // Look for patterns that indicate what the user was interested in
    const patterns = [
      /Service:\s*([^,\n]+)/i,
      /Case Study:\s*([^,\n]+)/i,
      /Blog Post:\s*([^,\n]+)/i,
      /Event:\s*([^,\n]+)/i,
      /Gallery Item:\s*([^,\n]+)/i,
      /Feedback:\s*([^,\n]+)/i,
    ];

    for (const pattern of patterns) {
      const match = description.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    // If no specific pattern, return the first sentence or a truncated version
    const firstSentence = description.split(/[.!?]/)[0];
    return firstSentence.length > 50
      ? firstSentence.substring(0, 50) + '...'
      : firstSentence;
  };

  const contextOfInterest = getContextOfInterest(inquiry.jobDescription);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-black">Inquiry Details</h2>
              <p className="text-sm text-gray-600 mt-1">
                Submitted on {new Date(inquiry.createdAt).toLocaleDateString()}{' '}
                at {new Date(inquiry.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Context of Interest Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Context of Interest
            </h3>
            <p className="text-blue-800 font-medium">{contextOfInterest}</p>
            <p className="text-sm text-blue-600 mt-2">
              This indicates what the user was interested in when they submitted
              the inquiry.
            </p>
          </div>

          {/* User-Submitted Data Section */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              User-Submitted Data
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-black font-medium">{inquiry.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {inquiry.email}
                  </a>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {inquiry.phone}
                  </a>
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <p className="text-black font-medium">
                    {inquiry.companyName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <p className="text-black">{inquiry.country}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <p className="text-black">{inquiry.jobTitle}</p>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Details
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-black whitespace-pre-wrap">
                  {inquiry.jobDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Management Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Admin Management
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </label>
                <div className="flex items-center space-x-3">
                  <StatusBadge status={inquiry.status} />
                  <select
                    value={inquiry.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Last Updated */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Updated
                </label>
                <p className="text-black">
                  {new Date(inquiry.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(inquiry.updatedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                placeholder="Add internal notes about this inquiry..."
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {adminNotes.length}/2000 characters
                </p>
                <button
                  onClick={handleNotesUpdate}
                  disabled={isUpdating || adminNotes === inquiry.adminNotes}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {isUpdating ? 'Updating...' : 'Update Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
