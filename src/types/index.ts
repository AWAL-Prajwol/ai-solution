export interface IInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  jobTitle: string;
  jobDescription: string;
  status: 'pending' | 'in-progress' | 'completed' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super-admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPasswordResetToken {
  _id: string;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export interface IBlog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: Date;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICaseStudy {
  _id: string;
  clientName: string;
  projectTitle: string;
  content: string;
  results: string;
  industry: string;
  duration: string;
  technologies: string[];
  image: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  registrationLink: string;
  image: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInquiryInput {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  country: string;
  jobTitle: string;
  jobDescription: string;
}

export interface CreateAdminUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'super-admin';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface PasswordResetInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}
