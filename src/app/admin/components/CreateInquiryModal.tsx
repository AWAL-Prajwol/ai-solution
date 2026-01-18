'use client';

import { useState } from 'react';

interface CreateInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateInquiryModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateInquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    country: '',
    jobTitle: '',
    jobDescription: '',
    status: 'pending' as const,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {};

    switch (name) {
      case 'name':
        if (!value.trim()) errors.name = 'Name is required';
        else if (value.length < 2)
          errors.name = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          errors.email = 'Invalid email format';
        break;
      case 'phone':
        if (!value.trim()) errors.phone = 'Phone is required';
        else if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')))
          errors.phone = 'Invalid phone format';
        break;
      case 'companyName':
        if (!value.trim()) errors.companyName = 'Company name is required';
        break;
      case 'country':
        if (!value.trim()) errors.country = 'Country is required';
        break;
      case 'jobTitle':
        if (!value.trim()) errors.jobTitle = 'Job title is required';
        break;
      case 'jobDescription':
        if (!value.trim())
          errors.jobDescription = 'Job description is required';
        else if (value.length < 10)
          errors.jobDescription =
            'Job description must be at least 10 characters';
        break;
    }

    return errors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const errors = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, ...errors }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'status') {
        const fieldErrors = validateField(key, value);
        Object.assign(errors, fieldErrors);
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/inquiries/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          companyName: '',
          country: '',
          jobTitle: '',
          jobDescription: '',
          status: 'pending',
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create inquiry');
      }
    } catch (error) {
      console.error('Create inquiry error:', error);
      setError('Failed to create inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">Create New Inquiry</h2>
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

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <svg
                className="h-5 w-5 text-red-400"
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
              <p className="ml-3 text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.name
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter full name"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.email
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter email address"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.phone
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter phone number"
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.companyName
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter company name"
              />
              {fieldErrors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.companyName}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.country
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter country"
              />
              {fieldErrors.country && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.country}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.jobTitle
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter job title"
              />
              {fieldErrors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.jobTitle}
                </p>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Job Description *
            </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${
                fieldErrors.jobDescription
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              placeholder="Enter detailed job description"
            />
            {fieldErrors.jobDescription && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.jobDescription}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Initial Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white hover:border-gray-400"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-black bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Inquiry'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
