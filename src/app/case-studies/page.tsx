'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContactModal from '@/components/ContactModal';

export default function CaseStudiesPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState('');
  const [activeIndustry, setActiveIndustry] = useState('All Industries');
  const [caseStudies, setCaseStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const industries = [
    'All Industries',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Education',
    'Finance',
    'Energy',
  ];

  useEffect(() => {
    fetchCaseStudies();
  }, [activeIndustry]);

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/casestudies?industry=${encodeURIComponent(activeIndustry === 'All Industries' ? '' : activeIndustry)}`);
      const data = await response.json();
      setCaseStudies(data.caseStudies || []);
    } catch (error) {
      console.error('Error fetching case studies:', error);
      setCaseStudies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCaseStudyClick = (clientName: string, projectTitle: string) => {
    setSelectedCaseStudy(`Case Study: ${projectTitle} for ${clientName}`);
    setShowModal(true);
  };

  const handleIndustryClick = (industry: string) => {
    setActiveIndustry(industry);
  };

  // Filter case studies based on active industry
  const filteredCaseStudies = caseStudies;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Case Studies
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Real results from real clients. Discover how AI-Solutions has
            transformed digital employee experiences across industries,
            delivering measurable business outcomes and lasting impact.
          </p>
        </div>
      </section>

      {/* Industry Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {industries.map((industry, index) => (
              <button
                key={index}
                onClick={() => handleIndustryClick(industry)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeIndustry === industry
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {filteredCaseStudies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No case studies found for this industry.
              </p>
              <button
                onClick={() => handleIndustryClick('All Industries')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Case Studies
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCaseStudies.map((study) => (
                <div
                  key={study._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={study.image}
                      alt={study.projectTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {study.industry}
                      </span>
                      <span className="text-sm text-gray-500">
                        {study.duration}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {study.projectTitle}
                    </h3>
                    <p className="text-sm font-medium text-blue-600 mb-4">
                      {study.clientName}
                    </p>

                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {study.results}
                    </p>

                    {/* Technologies Used */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Technologies Used:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {study.technologies.map((tech: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleCaseStudyClick(
                          study.clientName,
                          study.projectTitle
                        )
                      }
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Success Story?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join these industry leaders in transforming your digital employee
            experience with AI-powered solutions that deliver measurable
            results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/contact')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            >
              Start Your Project
            </button>
            <button
              onClick={() => router.push('/services')}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
            >
              Explore Our Services
            </button>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        prefilledContext={selectedCaseStudy}
      />
    </div>
  );
}
