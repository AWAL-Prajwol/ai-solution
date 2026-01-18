// Email templates for various notifications

export const otpEmailTemplate = (otp: string, userName: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Your Verification Code</h1>
      <p style="color: #e8eaf6; margin: 10px 0 0 0;">AI-Solutions Account Security</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333; margin-top: 0;">Hello ${userName},</h2>
      
      <p>We received a request to verify your account. Please use the following verification code to complete the process:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="display: inline-block; background: #f8f9fa; padding: 15px 25px; border-radius: 8px; border: 2px dashed #667eea; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
          ${otp}
        </div>
      </div>
      
      <p>This code will expire in 10 minutes. If you didn't request this verification, please ignore this email or contact our support team.</p>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="https://ai-solutions.com" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Visit Our Website</a>
      </div>
    </div>
    
    <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
      <p>© 2024 AI-Solutions. All rights reserved.</p>
      <p>This is an automated message from AI-Solutions. Please do not reply to this email.</p>
    </div>
  </div>
`;

export const passwordResetEmailTemplate = (resetLink: string, userName: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset Request</h1>
      <p style="color: #e8eaf6; margin: 10px 0 0 0;">AI-Solutions Account Security</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333; margin-top: 0;">Hello ${userName},</h2>
      
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      
      <div style="margin: 30px 0; text-align: center;">
        <a href="${resetLink}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
      </div>
      
      <p>If the button doesn't work, copy and paste the following link into your browser:</p>
      <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
      
      <p>This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact our support team.</p>
    </div>
    
    <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
      <p>© 2024 AI-Solutions. All rights reserved.</p>
      <p>This is an automated message from AI-Solutions. Please do not reply to this email.</p>
    </div>
  </div>
`;

export const welcomeEmailTemplate = (userName: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to AI-Solutions!</h1>
      <p style="color: #e8eaf6; margin: 10px 0 0 0;">Your Digital Transformation Partner</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333; margin-top: 0;">Hello ${userName},</h2>
      
      <p>Welcome to AI-Solutions! We're excited to have you as part of our community of forward-thinking organizations.</p>
      
      <p>With AI-Solutions, you'll be able to:</p>
      <ul style="margin: 20px 0; padding-left: 20px;">
        <li style="margin-bottom: 10px;">Transform your digital employee experience</li>
        <li style="margin-bottom: 10px;">Automate repetitive tasks with AI-powered solutions</li>
        <li style="margin-bottom: 10px;">Reduce IT support workload by up to 70%</li>
        <li style="margin-bottom: 10px;">Improve operational efficiency and productivity</li>
      </ul>
      
      <p>Get started by exploring our platform and resources. If you have any questions, our support team is always here to help.</p>
      
      <div style="margin-top: 30px; text-align: center;">
        <a href="https://ai-solutions.com/dashboard" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Access Your Dashboard</a>
      </div>
    </div>
    
    <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
      <p>© 2024 AI-Solutions. All rights reserved.</p>
      <p>This is an automated message from AI-Solutions. Please do not reply to this email.</p>
    </div>
  </div>
`;

export const contactFormEmailTemplate = (formData: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
      <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      <p style="color: #e8eaf6; margin: 10px 0 0 0;">AI-Solutions Customer Inquiry</p>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333; margin-top: 0;">Customer Details</h2>
      
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${formData.companyName || 'Not provided'}</p>
      <p><strong>Country:</strong> ${formData.country || 'Not provided'}</p>
      <p><strong>Job Title:</strong> ${formData.jobTitle || 'Not provided'}</p>
      
      <h2 style="color: #333;">Inquiry Details</h2>
      <p style="background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; border-radius: 4px;">
        ${formData.jobDescription}
      </p>
      
      <div style="margin-top: 30px; text-align: center;">
        <p style="color: #666; font-size: 14px;">
          Please follow up with this customer as soon as possible.
        </p>
      </div>
    </div>
    
    <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
      <p>© 2024 AI-Solutions. All rights reserved.</p>
      <p>This is an automated message from AI-Solutions. Please do not reply to this email.</p>
    </div>
  </div>
`;