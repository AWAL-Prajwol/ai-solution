'use client';

import { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';

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

interface MetricsData {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  rejected: number;
}

export default function AnalyticsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [statusFilter, dateFrom, dateTo]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      // Build query parameters
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await fetch(`/api/admin/inquiries?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries);
        setMetrics(data.metrics);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Fetch analytics error:', error);
      setError('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem('adminToken');

      // Build query parameters for export
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await fetch(`/api/admin/analytics/export?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inquiries-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to export data');
      }
    } catch (error) {
      console.error('Export error:', error);
      setError('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  if (loading && inquiries.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics & Reports
        </h1>
        <p className="text-gray-600 mt-2">
          View insights and export inquiry data
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Export Filters
          </h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>

            <button
              onClick={exportToCSV}
              disabled={exporting}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? 'Exporting...' : 'Export to CSV'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Metrics Summary */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-gray-900">
              {metrics.total}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {metrics.pending}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.inProgress}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-green-600">
              {metrics.completed}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-2xl font-bold text-red-600">
              {metrics.rejected}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>
      )}

      {/* Data Preview */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Data Preview</h2>
          <p className="text-sm text-gray-600 mt-1">
            Showing {inquiries.length} inquiries matching your filters
          </p>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.slice(0, 10).map((inquiry) => (
                <tr key={inquiry._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {inquiry.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {inquiry.email}
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
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={inquiry.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {inquiries.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No inquiries found matching your filters
            </p>
          </div>
        )}

        {inquiries.length > 10 && (
          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Showing first 10 of {inquiries.length} inquiries. Use the export
              button to download all data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
