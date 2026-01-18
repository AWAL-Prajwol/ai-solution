'use client';

import { usePathname } from 'next/navigation';
import ChatbotWrapper from '@/components/ChatbotWrapper';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && (
        <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-blue-500/20 shadow-lg">
          <nav className="max-w-7xl mx-auto flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <img
                src="/ai-solution.png"
                alt="AI-Solutions Logo"
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                <a href="/">AI-Solutions</a>
              </span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <a
                href="/services"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                Services
              </a>
              <a
                href="/case-studies"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                Case Studies
              </a>
              <a
                href="/feedback"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                Feedback
              </a>
              <a
                href="/blog"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                Blog
              </a>
              <a
                href="/gallery"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                Gallery
              </a>
              <a
                href="/events"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                Events
              </a>
              <a
                href="/contact"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
              >
                Contact
              </a>
            </div>
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-blue-400">
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </nav>
        </header>
      )}

      <main
        className={isAdminRoute ? 'min-h-screen' : 'min-h-[calc(100dvh-120px)]'}
      >
        {children}
      </main>

      {!isAdminRoute && (
        <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-t border-blue-500/20">
          <div className="max-w-7xl mx-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src="/ai-solution.png"
                    alt="AI-Solutions Logo"
                    className="h-8 w-8"
                  />
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    AI-Solutions
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Empowering businesses with intelligent solutions for the
                  digital age.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Services</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a
                      href="/services#ai-helpdesk"
                      className="hover:text-blue-400 transition-colors"
                    >
                      AI Employee Helpdesk
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services#system-monitoring"
                      className="hover:text-blue-400 transition-colors"
                    >
                      System Health Monitoring
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services#customer-intelligence"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Customer Intelligence
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services#knowledge-management"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Knowledge Management
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services#workflow-automation"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Workflow Automation
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services#predictive-analytics"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Predictive Analytics
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a
                      href="/case-studies"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Case Studies
                    </a>
                  </li>
                  <li>
                    <a
                      href="/blog"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="/events"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Events
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="hover:text-blue-400 transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Connect</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Ready to transform your business with AI?
                </p>
                <a
                  href="/contact"
                  className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                >
                  Get Started
                </a>
              </div>
            </div>
            <div className="border-t border-blue-500/20 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} AI-Solutions. All rights reserved.
                | Empowering the future with AI.
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* Chatbot - Only show on non-admin routes */}
      {!isAdminRoute && <ChatbotWrapper />}
    </>
  );
}
