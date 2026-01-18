# AI Solutions - Business Website with Admin Panel

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)

A modern, full-stack web application for AI Solutions company featuring a public business website and a comprehensive admin panel for content management. Built with Next.js 15, TypeScript, and MongoDB.

## 🌟 Features

### Public Website

- **Hero Section**: Eye-catching landing page with AI solutions branding
- **Services**: Showcase of AI-powered services (Helpdesk, Analytics, Automation, etc.)
- **Case Studies**: Success stories and project showcases
- **Blog**: Content management for articles and insights
- **Events**: Event listings with registration links
- **Feedback System**: Customer testimonials and reviews
- **Contact Form**: Lead generation with inquiry management
- **Gallery**: Image gallery for projects and achievements
- **Chatbot**: Integrated AI chatbot for user interaction

### Admin Panel

- **Secure Authentication**: JWT-based login with Argon2 password hashing
- **OTP Password Reset**: Secure password recovery with email integration
- **Dashboard Analytics**: Real-time metrics and insights
- **Inquiry Management**: Full CRUD operations with status tracking
- **Content Management**: Blog posts, case studies, events, and feedback
- **File Uploads**: Image upload functionality for content
- **Export Features**: CSV export for analytics and reports
- **Responsive Design**: Mobile-friendly admin interface

### Technical Features

- **Type-Safe**: Full TypeScript implementation
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS with custom gradients
- **Testing**: Vitest for unit and integration tests
- **Linting**: ESLint with Prettier for code quality
- **API Routes**: RESTful API endpoints for all operations

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework

### Backend

- **Next.js API Routes** - Server-side API
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Argon2** - Password hashing
- **Nodemailer** - Email service (configurable)

### Development Tools

- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **tsx** - TypeScript execution

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **npm** or **yarn** package manager

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ai-solutions
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env.local` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/ai-solutions
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-solutions

   JWT_SECRET=your-super-secure-jwt-secret-key-here
   ```

4. **Seed the database** (optional)
   ```bash
   npm run db:seed
   ```

## 🏃‍♂️ Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### Production Build

```bash
npm run build
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 👨‍💼 Admin Panel Access

1. Navigate to `/admin`
2. Default login credentials:
   - **Email**: admin@ai-solutions.com
   - **Password**: admin123
3. Change password after first login for security

### Admin Features

- **Dashboard**: Overview with metrics and recent activity
- **Inquiries**: Manage customer inquiries with status updates
- **Content**: Create and manage blog posts, case studies, events
- **Feedback**: Review and approve customer feedback
- **Analytics**: View reports and export data
- **Settings**: User management and system configuration

## 📚 API Documentation

### Authentication

- `POST /api/admin/login` - Admin login
- `POST /api/admin/forgot-password` - Request OTP
- `POST /api/admin/reset-password` - Reset password
- `GET /api/admin/verify` - Verify token

### Inquiries

- `GET /api/admin/inquiries` - List inquiries
- `GET /api/admin/inquiries/[id]` - Get inquiry details
- `PATCH /api/admin/inquiries/[id]` - Update inquiry
- `DELETE /api/admin/inquiries/[id]` - Delete inquiry

### Content Management

- `GET/POST /api/admin/blog` - Blog CRUD
- `GET/POST /api/admin/casestudies` - Case studies CRUD
- `GET/POST /api/admin/events` - Events CRUD
- `GET/POST /api/admin/feedback` - Feedback CRUD

### Public APIs

- `GET /api/blog` - Public blog posts
- `GET /api/casestudies` - Public case studies
- `POST /api/contact` - Submit contact form
- `POST /api/feedback` - Submit feedback

## 📜 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (clear all data)

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Database connections, models, utilities
- **Integration Tests**: Page rendering and API interactions
- Tests are located in the `tests/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new features
- Use conventional commit messages

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Contact

For questions or support, please contact the development team.

---

**Built with ❤️ using Next.js and modern web technologies**
