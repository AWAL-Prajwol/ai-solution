'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ResetPassword() {
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateOtpField = (value: string) => {
    if (!value.trim()) return 'OTP is required';
    else if (!/^\d{6}$/.test(value)) return 'OTP must be 6 digits';
    return '';
  };

  const validatePasswordField = (value: string) => {
    if (!value.trim()) return 'New password is required';
    else if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateConfirmPasswordField = (value: string, password: string) => {
    if (!value.trim()) return 'Please confirm your password';
    else if (value !== password) return 'Passwords do not match';
    return '';
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtp(value);
    
    // Clear field error when user starts typing
    if (fieldErrors.otp) {
      setFieldErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
      // Clear field error when user starts typing
      if (fieldErrors.newPassword) {
        setFieldErrors(prev => ({ ...prev, newPassword: '' }));
      }
      // Re-validate confirm password if it exists
      if (confirmPassword) {
        const error = validateConfirmPasswordField(confirmPassword, value);
        setFieldErrors(prev => ({ ...prev, confirmPassword: error }));
      }
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
      // Clear field error when user starts typing
      if (fieldErrors.confirmPassword) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleOtpBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const error = validateOtpField(e.target.value);
    setFieldErrors(prev => ({ ...prev, otp: error }));
  };

  const handlePasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      const error = validatePasswordField(value);
      setFieldErrors(prev => ({ ...prev, newPassword: error }));
    } else if (name === 'confirmPassword') {
      const error = validateConfirmPasswordField(value, newPassword);
      setFieldErrors(prev => ({ ...prev, confirmPassword: error }));
    }
  };

  const validateOtpForm = () => {
    const error = validateOtpField(otp);
    setFieldErrors({ otp: error });
    return !error;
  };

  const validatePasswordForm = () => {
    const passwordError = validatePasswordField(newPassword);
    const confirmPasswordError = validateConfirmPasswordField(confirmPassword, newPassword);
    
    setFieldErrors({
      newPassword: passwordError,
      confirmPassword: confirmPasswordError
    });
    
    return !passwordError && !confirmPasswordError;
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateOtpForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // We'll validate the OTP with the API
      const response = await fetch('/api/admin/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // OTP is valid, move to password step
        setStep('password');
      } else {
        setError(data.error || 'Failed to verify OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('Unable to verify OTP. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(
          errorData.error || 'Failed to reset password. Please try again.'
        );
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError(
        'Unable to connect to server. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100 text-center">
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
            <h3 className="text-2xl font-bold text-black mb-4">
              Password Reset!
            </h3>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>
            <Link
              href="/admin"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-black">
              {step === 'otp' ? 'Verify OTP' : 'Reset Password'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 'otp' 
                ? 'Enter the 6-digit code sent to your email' 
                : 'Create a new password for your account'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
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

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              {/* OTP Field */}
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-black mb-2"
                >
                  OTP Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  autoComplete="off"
                  value={otp}
                  onChange={handleOtpChange}
                  onBlur={handleOtpBlur}
                  maxLength={6}
                  className={`appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-lg tracking-widest ${
                    fieldErrors.otp
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  placeholder="000000"
                />
                {fieldErrors.otp && (
                  <p className="mt-2 text-sm text-red-600">{fieldErrors.otp}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading || !!fieldErrors.otp}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
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
                      Verifying OTP...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </div>

              {/* Back to Login Link */}
              <div className="text-center">
                <Link
                  href="/admin"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}

          {/* Password Reset Step */}
          {step === 'password' && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              {/* New Password Field */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-black mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    className={`appearance-none relative block w-full px-4 py-3 pr-12 border rounded-lg placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      fieldErrors.newPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Enter your new password"
                  />
                  {/* Password Toggle Button */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.newPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    className={`appearance-none relative block w-full px-4 py-3 pr-12 border rounded-lg placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      fieldErrors.confirmPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    placeholder="Confirm your new password"
                  />
                  {/* Password Toggle Button */}
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-400 hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    Object.keys(fieldErrors).some((key) => fieldErrors[key])
                  }
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
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
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>

              {/* Back to Login Link */}
              <div className="text-center">
                <Link
                  href="/admin"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}