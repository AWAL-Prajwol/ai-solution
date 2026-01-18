import { z } from 'zod';

export const inquirySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits'),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must be less than 100 characters'),
  jobTitle: z
    .string()
    .min(2, 'Job title must be at least 2 characters')
    .max(100, 'Job title must be less than 100 characters'),
  jobDescription: z
    .string()
    .min(10, 'Job description must be at least 10 characters')
    .max(1000, 'Job description must be less than 1000 characters'),
});

export const adminUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  role: z.enum(['admin', 'super-admin']).default('admin'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
export type AdminUserInput = z.infer<typeof adminUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
