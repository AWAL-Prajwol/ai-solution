import dotenv from 'dotenv';
dotenv.config();

import dbConnect from '../lib/db';
import AdminUser from '../models/AdminUser';
import Inquiry from '../models/Inquiry';
import Event from '../models/Event';
import Feedback from '../models/Feedback';
import Blog from '../models/Blog';
import CaseStudy from '../models/CaseStudy';
import argon2 from 'argon2';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await dbConnect();
    console.log('✅ Connected to database');

    // Clear existing data
    await AdminUser.deleteMany({});
    await Inquiry.deleteMany({});
    await Event.deleteMany({});
    await Feedback.deleteMany({});
    await Blog.deleteMany({});
    await CaseStudy.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create admin user
    const hashedPassword = await argon2.hash('admin123', {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const adminUser = new AdminUser({
      email: 'admin@ai-solutions.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'super-admin',
      isActive: true,
    });

    await adminUser.save();
    console.log('👤 Created admin user: admin@ai-solutions.com / admin123');

    // Create sample inquiries
    const sampleInquiries = [
      {
        name: 'John Smith',
        email: 'john.smith@techcorp.com',
        phone: '+447911123456',
        companyName: 'TechCorp Ltd',
        country: 'United Kingdom',
        jobTitle: 'CTO',
        jobDescription:
          'We need an AI solution to automate our customer service operations and improve response times. Our current system is manual and causing delays.',
        status: 'pending',
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@healthcareplus.com',
        phone: '+447700987654',
        companyName: 'Healthcare Plus',
        country: 'United Kingdom',
        jobTitle: 'Operations Director',
        jobDescription:
          'Looking for AI-powered automation to streamline our patient appointment scheduling and reduce administrative overhead.',
        status: 'in-progress',
      },
      {
        name: 'Michael Chen',
        email: 'm.chen@manufacturing.co.uk',
        phone: '+447800456789',
        companyName: 'UK Manufacturing',
        country: 'United Kingdom',
        jobTitle: 'Production Manager',
        jobDescription:
          'Need AI solutions for predictive maintenance and quality control in our manufacturing processes.',
        status: 'completed',
      },
      {
        name: 'Emma Wilson',
        email: 'emma.w@retailchain.com',
        phone: '+447600111222',
        companyName: 'Retail Chain',
        country: 'United Kingdom',
        jobTitle: 'Digital Transformation Lead',
        jobDescription:
          'Seeking AI solutions for inventory management optimization and customer behavior analysis.',
        status: 'pending',
      },
    ];

    for (const inquiryData of sampleInquiries) {
      const inquiry = new Inquiry(inquiryData);
      await inquiry.save();
    }
    console.log(`📝 Created ${sampleInquiries.length} sample inquiries`);

    // Create sample events with better images
    const sampleEvents = [
      {
        title: 'Digital Employee Experience Summit 2024',
        description: 'Join industry leaders and AI experts for two days of insights on transforming workplace productivity through AI-powered digital employee experience solutions.',
        date: new Date('2024-04-15'),
        location: 'Sunderland Conference Centre',
        registrationLink: '/contact',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        published: true,
      },
      {
        title: 'AI-Powered Customer Service Workshop',
        description: 'Learn how to implement AI helpdesks that reduce IT support workload by 70% while improving response times and employee satisfaction.',
        date: new Date('2024-05-20'),
        location: 'London Tech Hub',
        registrationLink: '/contact',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        published: true,
      },
      {
        title: 'Predictive Maintenance Masterclass',
        description: 'Discover how manufacturing companies are using AI to predict equipment failures and reduce downtime by 60% with our predictive maintenance solutions.',
        date: new Date('2024-06-12'),
        location: 'Manchester Innovation Center',
        registrationLink: '/contact',
        image: 'https://images.unsplash.com/photo-1581091226033-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        published: true,
      },
      {
        title: 'Data Analytics for Retail Optimization',
        description: 'Transform your retail operations with AI-powered inventory management and customer behavior analysis to boost sales and reduce costs.',
        date: new Date('2024-07-08'),
        location: 'Birmingham Business Park',
        registrationLink: '/contact',
        image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        published: true,
      },
    ];

    for (const eventData of sampleEvents) {
      const event = new Event(eventData);
      await event.save();
    }
    console.log(`📅 Created ${sampleEvents.length} sample events`);

    // Create sample blog posts with images
    const sampleBlogs = [
      {
        title: 'The Future of AI in Employee Experience',
        excerpt: 'How artificial intelligence is revolutionizing workplace productivity and employee satisfaction',
        content: 'Artificial intelligence is transforming the modern workplace in unprecedented ways. From automating routine tasks to providing personalized learning experiences, AI is enhancing employee productivity and satisfaction like never before. In this article, we explore the latest trends and practical applications of AI in employee experience.',
        image: 'https://images.unsplash.com/photo-1677442135722-5f11e06a4e6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        author: 'AI Solutions Team',
        date: new Date(),
        readTime: '5 min read',
        category: 'AI Technology',
        published: true,
      },
      {
        title: '5 Ways AI Can Reduce IT Support Workload',
        excerpt: 'Implementing AI helpdesks to streamline support operations and improve response times',
        content: 'IT support teams are often overwhelmed with repetitive queries that consume valuable time and resources. AI-powered helpdesks can automatically resolve up to 70% of common issues, freeing up human agents to focus on complex problems. Here are five proven strategies for implementing AI solutions in your IT support workflow.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        author: 'Sarah Johnson',
        date: new Date(),
        readTime: '4 min read',
        category: 'IT Solutions',
        published: true,
      },
    ];

    for (const blogData of sampleBlogs) {
      const blog = new Blog(blogData);
      await blog.save();
    }
    console.log(`📝 Created ${sampleBlogs.length} sample blog posts`);

    // Create sample case studies with images
    const sampleCaseStudies = [
      {
        clientName: 'Northeast Regional Hospital',
        projectTitle: 'Transforming Patient Care with AI Helpdesks',
        content: 'Northeast Regional Hospital faced significant challenges with their IT support system, which was causing delays in patient care. By implementing our AI-powered helpdesk solution, they achieved remarkable results: 70% reduction in IT support tickets, 40% improvement in response times, and most importantly, higher patient satisfaction scores. This case study explores their journey and the measurable impact of our solution.',
        results: '70% reduction in IT support tickets, 40% improvement in response times, and higher patient satisfaction scores',
        industry: 'Healthcare',
        duration: '6 months',
        technologies: ['AI Helpdesk', 'Natural Language Processing', 'Machine Learning'],
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        published: true,
      },
      {
        clientName: 'TechFlow Manufacturing',
        projectTitle: 'Predictive Maintenance Success',
        content: 'TechFlow Manufacturing was experiencing frequent equipment failures that resulted in costly downtime and production delays. Our predictive maintenance solution leveraged machine learning algorithms to analyze equipment data and predict failures before they occurred. The results were impressive: 60% reduction in unplanned downtime, £2M in annual savings, and a 25% increase in overall equipment effectiveness.',
        results: '60% reduction in unplanned downtime, £2M in annual savings, and a 25% increase in overall equipment effectiveness',
        industry: 'Manufacturing',
        duration: '8 months',
        technologies: ['IoT Sensors', 'Machine Learning', 'Predictive Analytics'],
        image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        published: true,
      },
    ];

    for (const caseStudyData of sampleCaseStudies) {
      const caseStudy = new CaseStudy(caseStudyData);
      await caseStudy.save();
    }
    console.log(`📚 Created ${sampleCaseStudies.length} sample case studies`);

    // Create sample feedback
    const sampleFeedback = [
      {
        name: 'Dr. Sarah Mitchell',
        email: 'sarah.m@northeast-hospital.com',
        company: 'Northeast Regional Hospital',
        rating: 5,
        feedback: 'AI-Solutions transformed our patient care system beyond expectations. The AI helpdesk reduced our IT support workload by 70%, allowing our staff to focus on patient care. The implementation was smooth, and the results were immediate. Our patient satisfaction scores have never been higher.',
        industry: 'Healthcare',
        approved: true,
      },
      {
        name: 'James Thompson',
        email: 'j.thompson@techflow.com',
        company: 'TechFlow Manufacturing',
        rating: 5,
        feedback: "The predictive maintenance system has been a game-changer for our production facility. We've reduced equipment downtime by 60% and saved over £2M annually. The AI-Solutions team understood our industry challenges and delivered exactly what we needed.",
        industry: 'Manufacturing',
        approved: true,
      },
      {
        name: 'Emma Rodriguez',
        email: 'e.rodriguez@global-retail.com',
        company: 'Global Retail Solutions',
        rating: 5,
        feedback: 'Implementing AI-Solutions\' inventory management system transformed our supply chain. We reduced stockouts by 85% and improved our forecasting accuracy by 92%. The ROI was evident within the first quarter.',
        industry: 'Retail',
        approved: true,
      },
    ];

    for (const feedbackData of sampleFeedback) {
      const feedback = new Feedback(feedbackData);
      await feedback.save();
    }
    console.log(`💬 Created ${sampleFeedback.length} sample feedback entries`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Email: admin@ai-solutions.com');
    console.log('Password: admin123');
    console.log('\n🔗 Admin Panel: http://localhost:3000/admin');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if called directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Seeding script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding script failed:', error);
      process.exit(1);
    });
}

export default seed;