'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardMetrics from './components/DashboardMetrics';
import StatusBadge from './components/StatusBadge';
import CreateInquiryModal from './components/CreateInquiryModal';

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

interface DashboardData {
  metrics: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    rejected: number;
  };
  recentActivity: Inquiry[];
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No dashboard data available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Overview of customer inquiries and recent activity
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create Inquiry
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <DashboardMetrics metrics={dashboardData.metrics} />

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <Link
              href="/admin/inquiries"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData.recentActivity.map((inquiry) => (
                <tr key={inquiry._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {inquiry.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {inquiry.companyName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.country}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.jobTitle}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={inquiry.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/inquiries/${inquiry._id}`}
                      className="text-blue-600 hover:text-blue-700 mr-4"
                    >
                      View
                    </Link>
                    <Link
                      href="/admin/inquiries"
                      className="text-gray-600 hover:text-gray-700"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {dashboardData.recentActivity.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link
          href="/admin/inquiries"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Manage Inquiries
              </h3>
              <p className="text-sm text-gray-600">
                View and manage all customer inquiries
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/analytics"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">
                View reports and export data
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/content"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Content Management</h3>
              <p className="text-sm text-gray-600">
                Manage blog posts, case studies, and events
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/feedback"
          className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-3">
              <svg
                className="w-6 h-6 text-yellow-600"
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
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Feedback Management</h3>
              <p className="text-sm text-gray-600">
                Approve and manage customer feedback
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Create Inquiry Modal */}
      <CreateInquiryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchDashboardData(); // Refresh data after creating inquiry
        }}
      />
    </div>
  );
}
