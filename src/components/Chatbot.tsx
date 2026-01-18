'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  text: string | React.ReactElement;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI-Solutions Virtual Assistant. I'm here to help you learn about our AI-powered digital employee experience transformation services. How may I assist you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // AI response logic based on common queries
  const generateAIResponse = (userMessage: string): React.ReactElement => {
    const message = userMessage.toLowerCase();

    // Specific employee experience query (fixed response)
    if (
      message.includes('employee experience') ||
      message.includes('workplace') ||
      message.includes('digital')
    ) {
      return (
        <span>
          We specialize in transforming the digital employee experience by accelerating design, engineering, and innovation processes. Our solutions enhance productivity, collaboration, and overall workplace satisfaction through advanced AI technologies.
        </span>
      );
    }

    // Services overview
    if (
      message.includes('service') ||
      message.includes('what do you do') ||
      message.includes('offer') ||
      message.includes('solution')
    ) {
      return (
        <span>
          AI-Solutions provides comprehensive AI-powered software solutions for digital employee experience transformation. Our key services include:
          <br /><br />
          • AI-Powered Employee Helpdesk (24/7 support reducing IT costs by 70%)
          <br />
          • Proactive System Health Monitoring (99.9% uptime guarantee)
          <br />
          • AI-Powered Customer Intelligence (28% conversion improvement)
          <br />
          • Intelligent Knowledge Management
          <br />
          • Automated Workflow Optimization
          <br />
          • Predictive IT Support Analytics
          <br /><br />
          For detailed information about our services, please visit our{' '}
          <Link
            href="/services"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            services page
          </Link>.
        </span>
      );
    }

    // Specific service inquiries
    if (message.includes('helpdesk') || message.includes('support')) {
      return (
        <span>
          Our AI-Powered Employee Helpdesk provides 24/7 intelligent support that reduces IT ticket volume by 70% while improving employee satisfaction. It uses natural language processing and machine learning to resolve 80% of common issues instantly. 
          <br /><br />
          Learn more about this service on our{' '}
          <Link
            href="/services"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            services page
          </Link>.
        </span>
      );
    }

    if (
      message.includes('monitoring') ||
      message.includes('health') ||
      message.includes('system')
    ) {
      return (
        <span>
          Our Proactive System Health Monitoring uses AI to predict and prevent system issues before they impact productivity, achieving 99.9% uptime. It continuously analyzes performance metrics and provides instant alerts.
          <br /><br />
          Detailed information is available on our{' '}
          <Link
            href="/services"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            services page
          </Link>.
        </span>
      );
    }

    if (
      message.includes('customer') ||
      message.includes('intelligence') ||
      message.includes('lead')
    ) {
      return (
        <span>
          Our AI-Powered Customer Intelligence platform captures visitor data and generates qualified leads, improving conversion rates by 28%. It provides seamless contact forms and admin dashboards for inquiry management.
          <br /><br />
          Visit our{' '}
          <Link
            href="/services"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            services page
          </Link>{' '}
          for more information.
        </span>
      );
    }

    if (message.includes('knowledge') || message.includes('management')) {
      return (
        <span>
          Our Intelligent Knowledge Management system organizes scattered information into actionable insights using AI-powered categorization and search. It improves problem resolution by 50% and enhances collaboration.
          <br /><br />
          Explore this solution on our{' '}
          <Link
            href="/services"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            services page
          </Link>.
        </span>
      );
    }

    if (
      message.includes('workflow') ||
      message.includes('automation') ||
      message.includes('process')
    ) {
      return (
        <span>
          Our Automated Workflow Optimization uses AI to identify and execute routine tasks, reducing manual work by 60% and improving accuracy. It integrates seamlessly with existing systems.
          <br /><br />
          Implementation details are available on our{' '}
          <Link
            href="/services"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            services page
          </Link>.
        </span>
      );
    }

    if (message.includes('predictive') || message.includes('analytics')) {
      return (
        <span>
          Our Predictive IT Support Analytics forecasts support needs and optimizes resource allocation using historical data analysis. It helps reduce IT costs by 30% through proactive planning.
          <br /><br />
          Learn more on our{' '}
          <Link
            href="/services"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            services page
          </Link>.
        </span>
      );
    }

    // Location and contact
    if (
      message.includes('location') ||
      message.includes('where') ||
      message.includes('sunderland') ||
      message.includes('based')
    ) {
      return (
        <span>
          We are headquartered in Sunderland, United Kingdom, but we serve clients globally. Our AI solutions are accessible to businesses worldwide through our web platform and remote implementation services.
        </span>
      );
    }

    if (
      message.includes('contact') ||
      message.includes('get in touch') ||
      message.includes('reach') ||
      message.includes('email') ||
      message.includes('phone')
    ) {
      return (
        <span>
          You can reach us through our{' '}
          <Link
            href="/contact"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            contact page
          </Link>
          , email us at info@ai-solutions.com, or call us directly. We guarantee a response within 24 hours and offer complimentary initial consultations.
        </span>
      );
    }

    // Pricing and affordability
    if (
      message.includes('price') ||
      message.includes('cost') ||
      message.includes('affordable') ||
      message.includes('pricing')
    ) {
      return (
        <span>
          We offer competitive and transparent pricing with no hidden fees. Our solutions are designed to be accessible to businesses of all sizes, with flexible pricing models that scale with your needs.
          <br /><br />
          For a customized quote based on your specific requirements, please{' '}
          <Link
            href="/contact"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            contact us
          </Link>{' '}
          for a detailed consultation.
        </span>
      );
    }

    // Industries and sectors
    if (
      message.includes('industry') ||
      message.includes('sector') ||
      message.includes('business') ||
      message.includes('healthcare') ||
      message.includes('manufacturing') ||
      message.includes('retail') ||
      message.includes('finance') ||
      message.includes('education')
    ) {
      return (
        <span>
          We serve diverse industries including healthcare, manufacturing, retail, financial services, education, and energy. Our solutions are tailored to address unique challenges in each sector.
          <br /><br />
          View our{' '}
          <Link
            href="/case-studies"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            case studies page
          </Link>{' '}
          to see real-world implementations across different industries.
        </span>
      );
    }

    // Time and implementation
    if (
      message.includes('time') ||
      message.includes('how long') ||
      message.includes('duration') ||
      message.includes('implementation') ||
      message.includes('deployment')
    ) {
      return (
        <span>
          Our rapid implementation approach means you can get working solutions in weeks, not months. We focus on quick prototype development and fast deployment, with most projects completed within 4-8 weeks depending on complexity.
        </span>
      );
    }

    // Events and workshops
    if (
      message.includes('event') ||
      message.includes('workshop') ||
      message.includes('conference') ||
      message.includes('training') ||
      message.includes('webinar')
    ) {
      return (
        <span>
          We host regular events including conferences, workshops, webinars, and training sessions. Our upcoming Digital Employee Experience Summit 2024 is April 15-16 in Sunderland.
          <br /><br />
          Check our{' '}
          <Link
            href="/events"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            events page
          </Link>{' '}
          for the full schedule and registration details.
        </span>
      );
    }

    // Blog and insights
    if (
      message.includes('blog') ||
      message.includes('article') ||
      message.includes('insight') ||
      message.includes('news') ||
      message.includes('update')
    ) {
      return (
        <span>
          Our blog features expert insights on digital transformation, AI trends, and workplace technology. Recent articles include 'The Future of Digital Employee Experience' and '5 Ways AI Helpdesks Reduce IT Costs by 70%'.
          <br /><br />
          Visit our{' '}
          <Link
            href="/blog"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            blog page
          </Link>{' '}
          to read our latest posts.
        </span>
      );
    }

    // Case studies and success stories
    if (
      message.includes('case study') ||
      message.includes('success') ||
      message.includes('result') ||
      message.includes('example') ||
      message.includes('client')
    ) {
      return (
        <span>
          We have successfully delivered 150+ projects with 99% client satisfaction. Our case studies show results like 70% reduction in IT support costs, 60% decrease in equipment downtime, and 28% improvement in conversion rates.
          <br /><br />
          Explore our{' '}
          <Link
            href="/case-studies"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            case studies page
          </Link>{' '}
          for detailed success stories.
        </span>
      );
    }

    // Feedback and testimonials
    if (
      message.includes('feedback') ||
      message.includes('review') ||
      message.includes('testimonial') ||
      message.includes('rating')
    ) {
      return (
        <span>
          Our clients consistently provide exceptional feedback, with an average rating of 5.0 and 99% satisfaction rate. Organizations like Northeast Regional Hospital and TechFlow Manufacturing have shared how our solutions transformed their operations.
          <br /><br />
          Read their testimonials on our{' '}
          <Link
            href="/feedback"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            feedback page
          </Link>.
        </span>
      );
    }

    // Gallery and portfolio
    if (
      message.includes('gallery') ||
      message.includes('portfolio') ||
      message.includes('image') ||
      message.includes('photo')
    ) {
      return (
        <span>
          Our gallery showcases event highlights and project implementations. You can see images from our Digital Employee Experience Summit 2023 and other successful deployments.
          <br /><br />
          Visit our{' '}
          <Link
            href="/gallery"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            gallery page
          </Link>{' '}
          to view our portfolio.
        </span>
      );
    }

    // AI and technology focus
    if (
      message.includes('ai') ||
      message.includes('artificial intelligence') ||
      message.includes('machine learning') ||
      message.includes('technology')
    ) {
      return (
        <span>
          AI is at the core of everything we do. We leverage cutting-edge artificial intelligence, machine learning, and automation to deliver solutions that drive growth, efficiency, and innovation. Our AI solutions are designed to adapt and evolve with your business needs.
        </span>
      );
    }

    // General help
    if (message.includes('help') || message.includes('assist')) {
      return (
        <span>
          I'm here to assist you with information about AI-Solutions. I can provide details about our services, share information about upcoming events, discuss our case studies, or direct you to the appropriate resources.
          <br /><br />
          You can also visit our main pages:{' '}
          <Link
            href="/services"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            services
          </Link>
          ,{' '}
          <Link
            href="/case-studies"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            case studies
          </Link>
          ,{' '}
          <Link
            href="/events"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            events
          </Link>
          ,{' '}
          <Link
            href="/blog"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            blog
          </Link>
          ,{' '}
          <Link
            href="/gallery"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            gallery
          </Link>
          , or{' '}
          <Link
            href="/contact"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            contact
          </Link>
          .
          <br /><br />
          What specific aspect of our services would you like to know more about?
        </span>
      );
    }

    // Default response
    return (
      <span>
        That's an excellent question. While I can provide general information about AI-Solutions, for specific project requirements or detailed technical discussions, I recommend using our{' '}
        <Link
          href="/contact"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          contact page
        </Link>{' '}
        to connect directly with our team of specialists.
        <br /><br />
        Is there something specific about our services, events, or case studies you'd like to explore further?
      </span>
    );
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">AI-Solutions Assistant</h3>
            <p className="text-xs text-blue-100">Online • Ready to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.isUser
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="text-sm">
                {typeof message.text === 'string' ? message.text : message.text}
              </div>
              <p
                className={`text-xs mt-1 ${
                  message.isUser ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Ask me about our services, location, pricing, or any other questions!
        </p>
      </div>
    </div>
  );
}
