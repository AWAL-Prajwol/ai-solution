'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ContactModal from '@/components/ContactModal';

export default function GalleryPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState('');

  const handleGalleryItemClick = (itemTitle: string) => {
    setSelectedGalleryItem(`Gallery Item: ${itemTitle}`);
    setShowModal(true);
  };

  const galleryItems = [
    {
      id: 1,
      title: 'Digital Employee Experience Summit 2023',
      caption:
        'Over 200 industry leaders gathered in Sunderland for our flagship conference on AI-powered workplace transformation.',
      category: 'Conference',
      date: 'November 2023',
      attendees: '200+',
      image: '/conference.png',
    },
    {
      id: 2,
      title: 'AI Helpdesk Implementation Workshop',
      caption:
        'Hands-on training session where participants learned to implement AI-powered helpdesk solutions that reduce IT support costs by 70%.',
      category: 'Workshop',
      date: 'October 2023',
      attendees: '45',
      image: 'workshop.png',
    },
    {
      id: 3,
      title: 'Manufacturing Innovation Day',
      caption:
        'Collaborative session with manufacturing leaders exploring predictive analytics and IoT solutions for smart factory operations.',
      category: 'Industry Event',
      date: 'September 2023',
      attendees: '80',
      image: 'industry.jpeg',
    },
    {
      id: 4,
      title: 'Rapid Prototyping Masterclass',
      caption:
        'Intensive training where participants learned to transform ideas into working prototypes in just 2 weeks using AI-powered development tools.',
      category: 'Masterclass',
      date: 'August 2023',
      attendees: '25',
      image: 'prototyping.jpg',
    },
    {
      id: 5,
      title: 'Healthcare Technology Symposium',
      caption:
        'Healthcare professionals exploring AI solutions for improving patient care and reducing administrative burden in medical facilities.',
      category: 'Symposium',
      date: 'July 2023',
      attendees: '120',
      image: 'healthcare.png',
    },

    {
      id: 6,
      title: 'Customer Intelligence Webinar',
      caption:
        'Virtual event exploring how AI-powered customer intelligence platforms can transform website visitors into qualified leads.',
      category: 'Webinar',
      date: 'March 2023',
      attendees: '500+',
      image: 'webinar.png',
    },
  ];

  const categories = [
    'All Events',
    'Conference',
    'Workshop',
    'Masterclass',
    'Symposium',
    'Training',
    'Webinar',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Event Gallery
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Relive the energy and innovation from our past events, workshops,
            and conferences. See how we bring together industry leaders to
            explore the future of digital employee experience.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Events Hosted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">
                2,000+
              </div>
              <div className="text-gray-600">Attendees</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">15+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  index === 0
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleGalleryItemClick(item.title)}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                {/* Image */}
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with event details */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end">
                    <div className="p-4 text-white w-full">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.date}</span>
                        <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">
                          {item.attendees}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-gray-700 text-sm leading-relaxed mb-4">
                    {item.caption}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {item.attendees} attendees
                    </div>
                    <button
                      onClick={() => router.push('/events')}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-300"
                    >
                      View Similar Events →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event Highlight */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-white bg-opacity-10 rounded-2xl p-8 md:p-12">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white bg-opacity-20 mb-6">
              Featured Event
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Digital Employee Experience Summit 2023
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Our most successful event to date, bringing together over 200
              industry leaders to explore the future of AI-powered workplace
              transformation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">200+</div>
                <div className="text-blue-100">Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">15</div>
                <div className="text-blue-100">Expert Speakers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">98%</div>
                <div className="text-blue-100">Satisfaction Rate</div>
              </div>
            </div>
            <button
              onClick={() => router.push('/events')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Join Our Next Event
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Be Part of Our Next Success Story
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join us at upcoming events to network with industry leaders, learn
            from experts, and discover how AI-Solutions can transform your
            digital employee experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/events')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            >
              View Upcoming Events
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-slate-900 transition-all duration-300"
            >
              Host Your Own Event
            </button>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        prefilledContext={selectedGalleryItem}
      />
    </div>
  );
}
