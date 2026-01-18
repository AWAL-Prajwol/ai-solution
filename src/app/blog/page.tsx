'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContactModal from '@/components/ContactModal';

export default function BlogPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState<any>(null);

  const categories = [
    'All Posts',
    'Digital Transformation',
    'AI Solutions',
    'Manufacturing',
    'Knowledge Management',
    'Customer Intelligence',
    'System Monitoring',
    'Healthcare',
  ];

  useEffect(() => {
    fetchBlogPosts();
  }, [activeCategory]);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog?category=${encodeURIComponent(activeCategory === 'All Posts' ? '' : activeCategory)}`);
      const data = await response.json();
      
      if (data.blogs && data.blogs.length > 0) {
        // Separate featured post from regular posts
        const featured = data.blogs.find((post: any) => post.featured);
        setFeaturedPost(featured || data.blogs[0]);
        setBlogPosts(data.blogs.filter((post: any) => !post.featured || post._id !== (featured || data.blogs[0])._id));
      } else {
        setFeaturedPost(null);
        setBlogPosts([]);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setBlogPosts([]);
      setFeaturedPost(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postTitle: string) => {
    setSelectedPost(`Blog Post: ${postTitle}`);
    setShowModal(true);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  // Filter posts based on active category
  const filteredPosts = blogPosts;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
              AI-Solutions Blog
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Insights, trends, and expert perspectives on digital employee
            experience, AI transformation, and the future of workplace
            technology.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                  Featured Post
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {featuredPost?.title || 'No featured post available'}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {featuredPost?.excerpt || 'No excerpt available'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {featuredPost?.author
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('') || 'A'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {featuredPost?.author || 'Author'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {featuredPost?.date ? new Date(featuredPost.date).toLocaleDateString() : 'Date'} • {featuredPost?.readTime || 'Read time'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => featuredPost?.title && handlePostClick(featuredPost.title)}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                    disabled={!featuredPost}
                  >
                    Read More
                  </button>
                </div>
              </div>
              <div className="h-64 overflow-hidden rounded-xl">
                {featuredPost?.image ? (
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
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
                        className="w-20 h-20 mx-auto mb-4"
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
                      <p className="text-lg font-medium">Featured Article</p>
                    </div>
                  </div>
                )}
              </div>
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
                onClick={() => handleCategoryClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
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

      {/* Blog Posts Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No posts found in this category.
              </p>
              <button
                onClick={() => handleCategoryClick('All Posts')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Posts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Image Placeholder - Updated to show actual images */}
                  <div className="h-48 overflow-hidden">
                    {post.image ? (
                      <img 
                        src={post.image} 
                        alt={post.title}
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
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <p className="text-sm font-medium">{post.category}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    {/* Author and Date */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-xs">
                            {post.author
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {post.author}
                          </div>
                          <div className="text-xs text-gray-500">
                            {post.date}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePostClick(post.title)}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-300"
                      >
                        Read More →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Updated with AI Insights
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest insights on digital employee experience, AI trends,
            and industry best practices delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss how AI-Solutions can help you implement the strategies
            and technologies we write about in our blog.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/contact')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105"
            >
              Start Your Transformation
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
        prefilledContext={selectedPost}
      />
    </div>
  );
}
