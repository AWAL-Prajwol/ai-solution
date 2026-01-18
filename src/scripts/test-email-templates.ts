import dotenv from 'dotenv';
dotenv.config();

import { otpEmailTemplate, passwordResetEmailTemplate, welcomeEmailTemplate, contactFormEmailTemplate } from '../lib/emailTemplates';

function testEmailTemplates() {
  console.log('Testing email templates...\n');

  // Test OTP email template
  const otpTemplate = otpEmailTemplate('123456', 'John Doe');
  console.log('✅ OTP Email Template generated successfully');
  console.log('Sample OTP template length:', otpTemplate.length, 'characters\n');

  // Test Password Reset email template
  const resetTemplate = passwordResetEmailTemplate('https://example.com/reset/abc123', 'John Doe');
  console.log('✅ Password Reset Email Template generated successfully');
  console.log('Sample reset template length:', resetTemplate.length, 'characters\n');

  // Test Welcome email template
  const welcomeTemplate = welcomeEmailTemplate('John Doe');
  console.log('✅ Welcome Email Template generated successfully');
  console.log('Sample welcome template length:', welcomeTemplate.length, 'characters\n');

  // Test Contact Form email template
  const contactTemplate = contactFormEmailTemplate({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    companyName: 'Example Corp',
    country: 'United States',
    jobTitle: 'CTO',
    jobDescription: 'We need help with AI implementation for our customer service.'
  });
  console.log('✅ Contact Form Email Template generated successfully');
  console.log('Sample contact template length:', contactTemplate.length, 'characters\n');

  console.log('🎉 All email templates are working correctly!');
}

testEmailTemplates();