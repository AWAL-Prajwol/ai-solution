'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContactModal from '@/components/ContactModal';

export default function ServicesPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(`Service: ${serviceName}`);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Our Services
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Transforming digital employee experience through intelligent AI
            solutions that accelerate innovation, streamline workflows, and
            drive measurable business outcomes across industries.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* AI-Powered Employee Helpdesk */}
            <div id="ai-helpdesk" className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9 8s9 3.582 9 8z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI-Powered Employee Helpdesk
              </h3>
              <p className="text-lg font-semibold text-blue-600 mb-4">
                24/7 intelligent support that reduces IT ticket volume by 70%
                while improving employee satisfaction.
              </p>

              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Problem:</strong> Traditional IT helpdesks struggle
                  with overwhelming ticket volumes, long response times, and
                  repetitive queries that drain resources and frustrate
                  employees.
                </p>

                <p>
                  <strong>Solution:</strong> Our AI-powered helpdesk leverages
                  natural language processing and machine learning to instantly
                  resolve 80% of common issues. Built on Node.js with real-time
                  MongoDB integration, it provides instant responses, automated
                  ticket routing, and intelligent escalation for complex
                  problems.
                </p>

                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Instant issue resolution with 95% accuracy</li>
                  <li>Automated ticket categorization and routing</li>
                  <li>Integration with existing IT infrastructure</li>
                  <li>Real-time analytics and performance insights</li>
                </ul>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Healthcare Use Case:</strong> A regional hospital
                    reduced IT support calls by 65% while improving clinician
                    access to patient systems through intelligent password
                    resets, software troubleshooting, and automated access
                    provisioning.
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleServiceClick('AI-Powered Employee Helpdesk')
                }
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
              >
                Request Helpdesk Demo
              </button>
            </div>

            {/* Proactive System Health Monitoring */}
            <div id="system-monitoring" className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
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

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Proactive System Health Monitoring
              </h3>
              <p className="text-lg font-semibold text-green-600 mb-4">
                Predict and prevent system issues before they impact employee
                productivity with 99.9% uptime guarantee.
              </p>

              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Problem:</strong> Reactive IT support leads to
                  unexpected downtime, lost productivity, and frustrated
                  employees when critical systems fail during peak business
                  hours.
                </p>

                <p>
                  <strong>Solution:</strong> Our AI-driven monitoring system
                  continuously analyzes system performance, network health, and
                  application metrics using advanced predictive algorithms.
                  Built with Next.js real-time dashboards and MongoDB analytics,
                  it provides instant alerts and automated remediation.
                </p>

                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Predictive failure detection with 90% accuracy</li>
                  <li>Automated system optimization and maintenance</li>
                  <li>Real-time performance dashboards and alerts</li>
                  <li>Integration with existing monitoring tools</li>
                </ul>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Manufacturing Use Case:</strong> A production
                    facility eliminated 95% of unplanned system outages by
                    implementing predictive monitoring that alerts technicians
                    to potential equipment failures before they cause production
                    delays.
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleServiceClick('Proactive System Health Monitoring')
                }
                className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
              >
                Schedule Monitoring Demo
              </button>
            </div>

            {/* AI-Powered Customer Intelligence */}
            <div id="customer-intelligence" className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI-Powered Customer Intelligence
              </h3>
              <p className="text-lg font-semibold text-purple-600 mb-4">
                Convert visitor interest into qualified leads with intelligent
                inquiry capture and analysis.
              </p>

              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Problem:</strong> Potential customers visit your site
                  but leave without engaging, making it impossible to gauge
                  demand or understand their specific software needs.
                </p>

                <p>
                  <strong>Solution:</strong> Our seamless contact system
                  captures crucial prospect information and provides a secure
                  admin dashboard to track, analyze, and manage all customer
                  inquiries efficiently.
                </p>

                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>
                    Frictionless contact forms with zero authentication barriers
                  </li>
                  <li>Secure password-protected admin analytics dashboard</li>
                  <li>Real-time inquiry tracking and demand forecasting</li>
                  <li>
                    Full data capture (contact details, company, job
                    requirements)
                  </li>
                </ul>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Non-Profit Use Case:</strong> An international
                    charity organization increased donor engagement by 45% using
                    our system to track and analyze supporter inquiries. The
                    admin dashboard revealed high demand for digital
                    volunteering opportunities, leading to a new virtual program
                    that attracted 500+ skilled volunteers in the first
                    quarter.{' '}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleServiceClick('AI-Powered Customer Intelligence')
                }
                className="mt-6 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
              >
                Capture More Leads
              </button>
            </div>

            {/* Intelligent Knowledge Management */}
            <div id="knowledge-management" className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Intelligent Knowledge Management
              </h3>
              <p className="text-lg font-semibold text-orange-600 mb-4">
                Transform scattered information into actionable insights with
                AI-powered knowledge discovery and organization.
              </p>

              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Problem:</strong> Critical company knowledge is
                  scattered across emails, documents, and systems, making it
                  difficult for employees to find relevant information quickly.
                </p>

                <p>
                  <strong>Solution:</strong> Our AI system automatically
                  categorizes, indexes, and connects knowledge across all
                  platforms. Using advanced NLP and MongoDB's aggregation
                  framework, it provides intelligent search, automated tagging,
                  and personalized content recommendations.
                </p>

                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Automated content categorization and tagging</li>
                  <li>Intelligent search with 95% relevance accuracy</li>
                  <li>Personalized knowledge recommendations</li>
                  <li>Integration with existing document systems</li>
                </ul>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Education Use Case:</strong> A university improved
                    research collaboration by 40% by implementing intelligent
                    knowledge management that automatically connects related
                    research papers, faculty expertise, and student projects
                    across departments.
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleServiceClick('Intelligent Knowledge Management')
                }
                className="mt-6 w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
              >
                Explore Knowledge Platform
              </button>
            </div>

            {/* Automated Workflow Optimization */}
            <div id="workflow-automation" className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Automated Workflow Optimization
              </h3>
              <p className="text-lg font-semibold text-indigo-600 mb-4">
                Streamline business processes with AI-driven automation that
                reduces manual tasks by 60% and improves accuracy.
              </p>

              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Problem:</strong> Manual, repetitive workflows consume
                  valuable employee time, introduce errors, and create
                  bottlenecks that slow down business operations.
                </p>

                <p>
                  <strong>Solution:</strong> Our workflow automation platform
                  uses AI to identify optimization opportunities and
                  automatically execute routine tasks. Built with Node.js
                  microservices and MongoDB for process tracking, it integrates
                  with existing systems to create seamless workflows.
                </p>

                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Intelligent process discovery and mapping</li>
                  <li>Automated task execution and routing</li>
                  <li>Real-time workflow analytics and optimization</li>
                  <li>Seamless integration with existing systems</li>
                </ul>

                <div className="bg-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-800">
                    <strong>Retail Use Case:</strong> A national retail chain
                    automated inventory management and reordering processes,
                    reducing stockouts by 75% and freeing up 20 hours per week
                    for store managers to focus on customer service.
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleServiceClick('Automated Workflow Optimization')
                }
                className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Optimize Your Workflows
              </button>
            </div>

            {/* Predictive IT Support Analytics */}
            <div id="predictive-analytics" className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-white"
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

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Predictive IT Support Analytics
              </h3>
              <p className="text-lg font-semibold text-teal-600 mb-4">
                Make data-driven IT decisions with predictive analytics that
                forecast support needs and optimize resource allocation.
              </p>

              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Problem:</strong> IT departments struggle with
                  reactive support models, leading to unpredictable workloads,
                  resource misallocation, and poor service delivery during peak
                  periods.
                </p>

                <p>
                  <strong>Solution:</strong> Our predictive analytics platform
                  analyzes historical support data, user behavior patterns, and
                  system metrics to forecast future support needs. Built with
                  Next.js dashboards and MongoDB aggregation pipelines, it
                  provides actionable insights for proactive planning.
                </p>

                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Predictive support demand forecasting</li>
                  <li>Resource optimization recommendations</li>
                  <li>Real-time performance trend analysis</li>
                  <li>Automated reporting and insights</li>
                </ul>

                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-sm text-teal-800">
                    <strong>Finance Use Case:</strong> A regional bank reduced
                    IT support costs by 30% by implementing predictive analytics
                    that accurately forecasted peak support periods during tax
                    season and system updates, enabling optimal staff
                    scheduling.
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleServiceClick('Predictive IT Support Analytics')
                }
                className="mt-6 w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
              >
                Get Analytics Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Digital Employee Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of organizations already leveraging our AI solutions
            to accelerate innovation and improve employee productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
              onClick={() => router.push('/contact')}
            >
              Schedule a Consultation
            </button>
            <button
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
              onClick={() => router.push('/case-studies')}
            >
              View Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        prefilledContext={selectedService}
      />
    </div>
  );
}
