'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/feedback');
      const data = await response.json();
      
      if (response.ok) {
        setFeedbackList(data.feedback || []);
      } else {
        setError(data.error || 'Failed to fetch feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approved: !currentStatus }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update the local state
        setFeedbackList(prev => 
          prev.map(item => 
            item._id === id ? { ...item, approved: !currentStatus } : item
          )
        );
      } else {
        setError(data.error || 'Failed to update feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Update error:', err);
    }
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/feedback/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Remove from local state
        setFeedbackList(prev => prev.filter(item => item._id !== id));
        // Show success message
        setError('Feedback deleted successfully');
        // Clear success message after 3 seconds
        setTimeout(() => setError(''), 3000);
      } else {
        setError(data.error || 'Failed to delete feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Delete error:', err);
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
          <p className="mt-2 text-gray-600">
            Manage customer feedback and reviews
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 border rounded-lg ${
            error.includes('successfully') 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center">
              {error.includes('successfully') ? (
                <svg
                  className="h-5 w-5 text-green-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              )}
              <span className={
                error.includes('successfully') 
                  ? 'text-green-800 font-medium' 
                  : 'text-red-800 font-medium'
              }>
                {error}
              </span>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Feedback Entries ({feedbackList.length})
            </h2>
          </div>
          
          {feedbackList.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by submitting feedback through the website.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {feedbackList.map((feedback) => (
                <li key={feedback._id} className="px-6 py-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
                        {feedback.name?.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {feedback.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {feedback.company} • {feedback.industry}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            feedback.approved 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {feedback.approved ? 'Approved' : 'Pending'}
                          </span>
                          <button
                            onClick={() => toggleApproval(feedback._id, feedback.approved)}
                            className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                              feedback.approved
                                ? 'bg-yellow-500 hover:bg-yellow-600'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                          >
                            {feedback.approved ? 'Unapprove' : 'Approve'}
                          </button>
                          <button
                            onClick={() => deleteFeedback(feedback._id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center">
                        <StarRating rating={feedback.rating} />
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{feedback.feedback}</p>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <p>{feedback.email}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}