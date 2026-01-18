'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackSubmitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    rating: 5,
    feedback: '',
    industry: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const industries = [
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Technology',
    'Finance',
    'Education',
    'Government',
    'Other',
  ];

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = { ...fieldErrors };

    switch (name) {
      case 'name':
        if (!value.trim()) errors.name = 'Name is required';
        else if (value.length < 2) errors.name = 'Name must be at least 2 characters';
        else if (value.length > 100) errors.name = 'Name cannot exceed 100 characters';
        else delete errors.name;
        break;
      case 'email':
        if (!value.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.email = 'Invalid email format';
        else if (value.length > 150) errors.email = 'Email cannot exceed 150 characters';
        else delete errors.email;
        break;
      case 'company':
        if (!value.trim()) errors.company = 'Company is required';
        else if (value.length < 2) errors.company = 'Company must be at least 2 characters';
        else if (value.length > 150) errors.company = 'Company cannot exceed 150 characters';
        else delete errors.company;
        break;
      case 'feedback':
        if (!value.trim()) errors.feedback = 'Feedback is required';
        else if (value.length < 10) errors.feedback = 'Feedback must be at least 10 characters';
        else if (value.length > 1000) errors.feedback = 'Feedback cannot exceed 1000 characters';
        else delete errors.feedback;
        break;
      case 'industry':
        if (!value.trim()) errors.industry = 'Industry is required';
        else if (value.length < 2) errors.industry = 'Industry must be at least 2 characters';
        else if (value.length > 100) errors.industry = 'Industry cannot exceed 100 characters';
        else delete errors.industry;
        break;
    }

    setFieldErrors(errors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof typeof formData];
      // Convert number to string for validation
      const stringValue = typeof value === 'number' ? value.toString() : value;
      
      switch (key) {
        case 'name':
          if (!stringValue.trim()) errors.name = 'Name is required';
          else if (stringValue.length < 2) errors.name = 'Name must be at least 2 characters';
          else if (stringValue.length > 100) errors.name = 'Name cannot exceed 100 characters';
          break;
        case 'email':
          if (!stringValue.trim()) errors.email = 'Email is required';
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) errors.email = 'Invalid email format';
          else if (stringValue.length > 150) errors.email = 'Email cannot exceed 150 characters';
          break;
        case 'company':
          if (!stringValue.trim()) errors.company = 'Company is required';
          else if (stringValue.length < 2) errors.company = 'Company must be at least 2 characters';
          else if (stringValue.length > 150) errors.company = 'Company cannot exceed 150 characters';
          break;
        case 'feedback':
          if (!stringValue.trim()) errors.feedback = 'Feedback is required';
          else if (stringValue.length < 10) errors.feedback = 'Feedback must be at least 10 characters';
          else if (stringValue.length > 1000) errors.feedback = 'Feedback cannot exceed 1000 characters';
          break;
        case 'industry':
          if (!stringValue.trim()) errors.industry = 'Industry is required';
          else if (stringValue.length < 2) errors.industry = 'Industry must be at least 2 characters';
          else if (stringValue.length > 100) errors.industry = 'Industry cannot exceed 100 characters';
          break;
      }
    });
    
    setFieldErrors(errors);
    
    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to feedback page with success parameter
        router.push('/feedback?success=true');
      } else {
        setError(data.error || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-8">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Thank You for Your Feedback!
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Your feedback has been submitted successfully. It will be reviewed and published shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/feedback')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
            >
              View All Feedback
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                router.push('/');
              }}
              className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Share Your Experience
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We value your feedback and use it to continuously improve our services. 
            Please share your experience with AI-Solutions.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
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
                  <span className="text-red-800 font-medium">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black ${
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black ${
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

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black ${
                      fieldErrors.company
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Enter your company name"
                  />
                  {fieldErrors.company && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.company}</p>
                  )}
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Industry *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black ${
                      fieldErrors.industry
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    <option value="">Select your industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry} className="text-black">
                        {industry}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.industry && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.industry}</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="text-3xl focus:outline-none"
                    >
                      {star <= formData.rating ? (
                        <span className="text-yellow-400">★</span>
                      ) : (
                        <span className="text-gray-400">☆</span>
                      )}
                    </button>
                  ))}
                  <span className="ml-2 text-gray-900">
                    {formData.rating} of 5 stars
                  </span>
                </div>
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black ${
                    fieldErrors.feedback
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  placeholder="Please share your detailed experience with our services..."
                />
                {fieldErrors.feedback && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.feedback}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Submitting...
                    </div>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}