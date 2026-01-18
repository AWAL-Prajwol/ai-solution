import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import Inquiry from '@/models/Inquiry';
import AdminUser from '@/models/AdminUser';
import PasswordResetToken from '@/models/PasswordResetToken';
import {
  inquirySchema,
  adminUserSchema,
  passwordResetSchema,
} from '@/lib/validation';

// Mock MongoDB connection
beforeEach(async () => {
  await mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
  );
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Inquiry Model', () => {
  it('should create a valid inquiry', async () => {
    const validInquiry = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      companyName: 'Tech Corp',
      country: 'United States',
      jobTitle: 'Software Engineer',
      jobDescription: 'We need a full-stack developer for our AI project.',
    };

    const inquiry = new Inquiry(validInquiry);
    const savedInquiry = await inquiry.save();

    expect(savedInquiry._id).toBeDefined();
    expect(savedInquiry.name).toBe(validInquiry.name);
    expect(savedInquiry.status).toBe('pending');
    expect(savedInquiry.createdAt).toBeDefined();
  });

  it('should fail with invalid email', async () => {
    const invalidInquiry = {
      name: 'John Doe',
      email: 'invalid-email',
      phone: '+1234567890',
      companyName: 'Tech Corp',
      country: 'United States',
      jobTitle: 'Software Engineer',
      jobDescription: 'We need a full-stack developer for our AI project.',
    };

    const inquiry = new Inquiry(invalidInquiry);
    await expect(inquiry.save()).rejects.toThrow();
  });

  it('should fail with missing required fields', async () => {
    const incompleteInquiry = {
      name: 'John Doe',
      email: 'john@example.com',
      // Missing other required fields
    };

    const inquiry = new Inquiry(incompleteInquiry);
    await expect(inquiry.save()).rejects.toThrow();
  });
});

describe('AdminUser Model', () => {
  it('should create a valid admin user', async () => {
    const validAdmin = {
      email: 'admin@example.com',
      password: 'securepassword123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    };

    const adminUser = new AdminUser(validAdmin);
    const savedAdmin = await adminUser.save();

    expect(savedAdmin._id).toBeDefined();
    expect(savedAdmin.email).toBe(validAdmin.email);
    expect(savedAdmin.role).toBe('admin');
    expect(savedAdmin.isActive).toBe(true);
  });

  it('should fail with duplicate email', async () => {
    const admin1 = new AdminUser({
      email: 'admin@example.com',
      password: 'password1',
      firstName: 'Admin',
      lastName: 'One',
    });

    const admin2 = new AdminUser({
      email: 'admin@example.com',
      password: 'password2',
      firstName: 'Admin',
      lastName: 'Two',
    });

    await admin1.save();
    await expect(admin2.save()).rejects.toThrow();
  });
});

describe('PasswordResetToken Model', () => {
  it('should create a valid reset token', async () => {
    const validToken = {
      email: 'user@example.com',
      token: 'random-token-string',
      expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    };

    const resetToken = new PasswordResetToken(validToken);
    const savedToken = await resetToken.save();

    expect(savedToken._id).toBeDefined();
    expect(savedToken.email).toBe(validToken.email);
    expect(savedToken.used).toBe(false);
  });

  it('should automatically expire old tokens', async () => {
    const expiredToken = {
      email: 'user@example.com',
      token: 'expired-token',
      expiresAt: new Date(Date.now() - 3600000), // 1 hour ago
    };

    const resetToken = new PasswordResetToken(expiredToken);
    await resetToken.save();

    // Wait a bit for TTL to process
    await new Promise((resolve) => setTimeout(resolve, 100));

    const foundToken = await PasswordResetToken.findOne({
      token: 'expired-token',
    });
    expect(foundToken).toBeNull();
  });
});

describe('Validation Schemas', () => {
  it('should validate inquiry schema correctly', () => {
    const validInquiry = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      companyName: 'Tech Corp',
      country: 'United States',
      jobTitle: 'Software Engineer',
      jobDescription: 'We need a full-stack developer for our AI project.',
    };

    const result = inquirySchema.safeParse(validInquiry);
    expect(result.success).toBe(true);
  });

  it('should reject invalid inquiry data', () => {
    const invalidInquiry = {
      name: 'J', // Too short
      email: 'invalid-email',
      phone: '123', // Too short
      companyName: 'Tech Corp',
      country: 'United States',
      jobTitle: 'Software Engineer',
      jobDescription: 'Short', // Too short
    };

    const result = inquirySchema.safeParse(invalidInquiry);
    expect(result.success).toBe(false);
  });
});
