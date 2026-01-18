'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContactModal from '@/components/ContactModal';

export default function FeedbackPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check for success message in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setShowSuccess(true);
      // Remove the success parameter from URL
      window.history.replaceState({}, document.title, '/feedback');
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      // Only show approved feedback
      const response = await fetch('/api/feedback');
      const data = await response.json();
      setReviews(data.feedback || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      // Fallback to hardcoded data if API fails
      setReviews([
        {
          id: 1,
          name: 'Dr. Sarah Mitchell',
          company: 'Northeast Regional Hospital',
          position: 'Chief Technology Officer',
          rating: 5,
          review:
            'AI-Solutions transformed our patient care system beyond expectations. The AI helpdesk reduced our IT support workload by 70%, allowing our staff to focus on patient care. The implementation was smooth, and the results were immediate. Our patient satisfaction scores have never been higher.',
          industry: 'Healthcare',
          date: 'March 2024',
        },
        {
          id: 2,
          name: 'James Thompson',
          company: 'TechFlow Manufacturing',
          position: 'Operations Director',
          rating: 5,
          review:
            "The predictive maintenance system has been a game-changer for our production facility. We've reduced equipment downtime by 60% and saved over £2M annually. The AI-Solutions team understood our industry challenges and delivered exactly what we needed.",
          industry: 'Manufacturing',
          date: 'February 2024',
        },
        {
          id: 3,
          name: 'Emma Rodriguez',
          company: 'Global Retail Solutions',
          position: 'Digital Transformation Lead',
          rating: 5,
          review:
            'Implementing AI-Solutions\' inventory management system transformed our supply chain. We reduced stockouts by 85% and improved our forecasting accuracy by 92%. The ROI was evident within the first quarter.',
          industry: 'Retail',
          date: 'January 2024',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackClick = (clientName: string, industry: string) => {
    setSelectedFeedback(`Feedback: ${industry} solution from ${clientName}`);
    setShowModal(true);
  };

  // Function to generate a random date in 2023 or 2024
  const getRandomPastDate = () => {
    const year = Math.random() > 0.5 ? 2024 : 2023;
    const month = Math.floor(Math.random() * 12);
    const date = new Date(year, month, 1);
    return date.toLocaleDateString('en-GB', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Customer Feedback
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear from the organizations that
            have transformed their digital employee experience with
            AI-Solutions.
          </p>
        </div>
      </section>

      {/* Success Message */}
      {showSuccess && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-green-400 mr-2"
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
              <span className="text-green-800 font-medium">
                Thank you for your feedback! It has been submitted successfully.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review._id || review.id}
                onClick={() =>
                  handleFeedbackClick(review.company, review.industry)
                }
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* Rating */}
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={review.rating} />
                  <span className="text-sm text-gray-500">
                    {review.createdAt 
                      ? getRandomPastDate() 
                      : (review.date || 'Recent')}
                  </span>
                </div>

                {/* Review Text */}
                <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                  "{review.review || review.feedback}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold mr-4">
                    {review.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-600">
                      {review.position || review.company}
                    </div>
                    <div className="text-xs text-gray-500">{review.industry}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Feedback CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Share Your Experience
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Have you worked with us? We'd love to hear about your experience and feature it here.
          </p>
          <button
            onClick={() => router.push('/feedback/submit')}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            Submit Your Feedback
          </button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Success Stories
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Ready to transform your digital employee experience? Let's discuss
            how AI-Solutions can deliver similar results for your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/contact')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today
            </button>
            <button
              onClick={() => router.push('/case-studies')}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
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
        prefilledContext={selectedFeedback}
      />
    </div>
  );
}