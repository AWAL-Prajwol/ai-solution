'use client';

import { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledContext?: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  prefilledContext = '',
}: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    country: '',
    jobTitle: '',
    jobDescription: prefilledContext,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      const fieldErrors = validateField(key, value);
      Object.assign(errors, fieldErrors);
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form after 3 seconds and close modal
        setTimeout(() => {
          setSuccess(false);
          onClose();
          setFormData({
            name: '',
            email: '',
            phone: '',
            companyName: '',
            country: '',
            jobTitle: '',
            jobDescription: prefilledContext,
          });
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setError('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-8 text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6">
              <svg
                className="h-10 w-10 text-white"
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
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Thank You!
            </h3>
            <p className="text-gray-600 mb-6">
              Your inquiry has been submitted successfully. We'll get back to
              you within 24 hours.
            </p>
            <p className="text-sm text-gray-500">
              This window will close automatically...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Get in Touch</h2>
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
          {prefilledContext && (
            <p className="text-sm text-blue-600 mt-2">
              Interested in: <strong>{prefilledContext}</strong>
            </p>
          )}
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
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.name
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter your full name"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.email
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter your email address"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.phone
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter your phone number"
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.companyName
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter your company name"
              />
              {fieldErrors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.companyName}
                </p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.country
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter your country"
              />
              {fieldErrors.country && (
                <p className="mt-1 text-sm text-red-600">
                  {fieldErrors.country}
                </p>
              )}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  fieldErrors.jobTitle
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter your job title"
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
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Project Details *
            </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${
                fieldErrors.jobDescription
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
              placeholder="Tell us about your project requirements, challenges, or how we can help..."
            />
            {fieldErrors.jobDescription && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.jobDescription}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
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
                  Sending...
                </>
              ) : (
                'Send Inquiry'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
