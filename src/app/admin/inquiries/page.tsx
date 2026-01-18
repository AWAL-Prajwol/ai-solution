'use client';

import { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import CreateInquiryModal from '../components/CreateInquiryModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import InquiryDetailModal from '../components/InquiryDetailModal';

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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MetricsData {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  rejected: number;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [
    statusFilter,
    companyFilter,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
    currentPage,
  ]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sortBy,
        sortOrder,
      });

      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (companyFilter) params.append('company', companyFilter);
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
        setPagination(data.pagination);
        setMetrics(data.metrics);
      } else {
        setError('Failed to fetch inquiries');
      }
    } catch (error) {
      console.error('Fetch inquiries error:', error);
      setError('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setInquiries((prev) =>
          prev.map((inquiry) =>
            inquiry._id === id
              ? { ...inquiry, status: newStatus as Inquiry['status'] }
              : inquiry
          )
        );

        // Update selected inquiry if it's the one being viewed
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry((prev) =>
            prev ? { ...prev, status: newStatus as Inquiry['status'] } : null
          );
        }
      }
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  const updateInquiryNotes = async (id: string, notes: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminNotes: notes }),
      });

      if (response.ok) {
        // Update local state
        setInquiries((prev) =>
          prev.map((inquiry) =>
            inquiry._id === id ? { ...inquiry, adminNotes: notes } : inquiry
          )
        );

        // Update selected inquiry if it's the one being viewed
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry((prev) =>
            prev ? { ...prev, adminNotes: notes } : null
          );
        }
      }
    } catch (error) {
      console.error('Update notes error:', error);
    }
  };

  const handleDeleteInquiry = (inquiry: Inquiry) => {
    setInquiryToDelete(inquiry);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!inquiryToDelete) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `/api/admin/inquiries/${inquiryToDelete._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        // Remove from local state
        setInquiries((prev) =>
          prev.filter((inquiry) => inquiry._id !== inquiryToDelete._id)
        );
        setShowDeleteModal(false);
        setInquiryToDelete(null);
        // Refresh data to update metrics
        fetchInquiries();
      } else {
        setError('Failed to delete inquiry');
      }
    } catch (error) {
      console.error('Delete inquiry error:', error);
      setError('Failed to delete inquiry');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetailModal(true);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setCompanyFilter('');
    setDateFrom('');
    setDateTo('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  if (loading && inquiries.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Inquiry Management
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all customer inquiries
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                placeholder="Search by company..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="createdAt">Date</option>
                <option value="companyName">Company</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                }
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Inquiries Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Customer Inquiries
          </h2>
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
                  Job Details
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
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {inquiry.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        <a
                          href={`mailto:${inquiry.email}`}
                          className="hover:text-blue-600"
                        >
                          {inquiry.email}
                        </a>
                      </div>
                      <div className="text-sm text-gray-500">
                        <a
                          href={`tel:${inquiry.phone}`}
                          className="hover:text-blue-600"
                        >
                          {inquiry.phone}
                        </a>
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
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {inquiry.jobDescription}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={inquiry.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <select
                        value={inquiry.status}
                        onChange={(e) =>
                          updateInquiryStatus(inquiry._id, e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-xs bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => handleViewInquiry(inquiry)}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteInquiry(inquiry)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        title="Delete inquiry"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {inquiries.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No inquiries found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-700">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))
              }
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateInquiryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchInquiries(); // Refresh data after creating inquiry
        }}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setInquiryToDelete(null);
        }}
        onConfirm={confirmDelete}
        inquiryName={inquiryToDelete?.name || ''}
        loading={deleteLoading}
      />

      <InquiryDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedInquiry(null);
        }}
        inquiry={selectedInquiry}
        onStatusUpdate={updateInquiryStatus}
        onNotesUpdate={updateInquiryNotes}
      />
    </div>
  );
}
