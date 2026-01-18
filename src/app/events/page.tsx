'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContactModal from '@/components/ContactModal';

export default function EventsPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Remove the upcoming=true filter to show all published events
      const response = await fetch('/api/events');
      const data = await response.json();
      console.log('Events API response:', data); // Debug log
      setUpcomingEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setUpcomingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventTitle: string) => {
    setSelectedEvent(`Event: ${eventTitle}`);
    setShowModal(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
              Events & Workshops
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Join us for exclusive events, workshops, and webinars designed to
            help you master digital employee experience transformation and AI
            implementation.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Events Found</h3>
              <p className="text-gray-600 mb-8">We're planning exciting events. Check back soon!</p>
              <button
                onClick={() => router.push('/contact')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
              >
                Get Notified
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {/* Event Image */}
                  <div className="h-48 overflow-hidden">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/600/400';
                        }}
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-full h-full flex items-center justify-center">
                        <div className="text-white text-center">
                          <svg
                            className="w-16 h-16 mx-auto mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm font-medium">Event</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Event Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Workshop
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        100 of 150 seats available
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{event.title}</h3>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatTime(event.date)}
                      </div>
                    </div>

                    <div className="flex items-center mb-4">
                      <svg
                        className="w-5 h-5 text-gray-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">
                          {event.location}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">
                      {event.description}
                    </p>

                    {/* Price and Register */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-2xl font-bold text-gray-900">
                        £299
                      </div>
                      <button
                        onClick={() => handleEventClick(event.title)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                      >
                        Register Now
                      </button>
                    </div>
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
            Can't Find the Right Event?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            We offer custom workshops and training sessions tailored to your
            organization's specific needs and digital transformation goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/contact')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            >
              Request Custom Training
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
        prefilledContext={selectedEvent}
      />
    </div>
  );
}