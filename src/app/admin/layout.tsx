'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        const response = await fetch('/api/admin/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem('adminToken');
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-black">Loading...</p>
        </div>
      </div>
    );
  }

  // Allow access to forgot password and reset password pages without authentication
  if (
    !isLoggedIn &&
    !pathname.includes('/forgot-password') &&
    !pathname.includes('/reset-password')
  ) {
    return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div
      className={`min-h-screen text-black ${isLoggedIn ? 'bg-gray-50' : ' bg-gradient-to-br from-blue-50 to-indigo-100'}`}
    >
      {/* Show header only for authenticated pages */}
      {isLoggedIn && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl font-bold text-black">Admin</h1>
                <nav className="flex space-x-6">
                  <Link
                    href="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/admin'
                        ? 'bg-blue-100 text-blue-800 font-semibold'
                        : 'text-black hover:text-blue-700 hover:bg-gray-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/inquiries"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/admin/inquiries'
                        ? 'bg-blue-100 text-blue-800 font-semibold'
                        : 'text-black hover:text-blue-700 hover:bg-gray-100'
                    }`}
                  >
                    Inquiries
                  </Link>
                  <Link
                    href="/admin/analytics"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/admin/analytics'
                        ? 'bg-blue-100 text-blue-800 font-semibold'
                        : 'text-black hover:text-blue-700 hover:bg-gray-100'
                    }`}
                  >
                    Analytics
                  </Link>
                  <Link
                    href="/admin/content"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/admin/content' || pathname.startsWith('/admin/content/')
                        ? 'bg-blue-100 text-blue-800 font-semibold'
                        : 'text-black hover:text-blue-700 hover:bg-gray-100'
                    }`}
                  >
                    Content
                  </Link>
                </nav>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main
        className={`max-w-7xl mx-auto px-6 py-8 text-black ${!isLoggedIn ? 'min-h-screen flex items-center justify-center' : ''}`}
      >
        {children}
      </main>
    </div>
  );
}

// Enhanced Admin Login Component
function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 3) {
      setPasswordError('Password must be at least 3 characters');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError('');
    setEmailError('');
    setPasswordError('');

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        onLoginSuccess();
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(errorData.error || 'Login failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        'Unable to connect to server. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Modern Card Layout */}
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-black">Admin Login</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access the AI-Solutions admin panel
            </p>
          </div>

          {/* Global Error Message */}
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

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={(e) => validateEmail(e.target.value)}
                className={`appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  emailError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
                placeholder="Enter your email address"
              />
              {emailError && (
                <p className="mt-2 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                  }}
                  onBlur={(e) => validatePassword(e.target.value)}
                  className={`appearance-none relative block w-full px-4 py-3 pr-12 border rounded-lg placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    passwordError
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  placeholder="Enter your password"
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
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || !!emailError || !!passwordError}
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
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link
                href="/admin/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
