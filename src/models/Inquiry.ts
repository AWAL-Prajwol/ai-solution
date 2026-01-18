import mongoose, { Schema, Document } from 'mongoose';
import { IInquiry, CreateInquiryInput } from '@/types';

const inquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [100, 'Country cannot exceed 100 characters'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [1000, 'Job description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed', 'rejected'],
        message:
          'Status must be one of: pending, in-progress, completed, rejected',
      },
      default: 'pending',
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Admin notes cannot exceed 2000 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
inquirySchema.index({ email: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ companyName: 1 });

// Virtual for full name
inquirySchema.virtual('fullName').get(function () {
  return `${this.name}`;
});

// Pre-save middleware for data cleaning
inquirySchema.pre('save', function (next) {
  this.name = this.name.trim();
  this.companyName = this.companyName.trim();
  this.jobTitle = this.jobTitle.trim();
  this.jobDescription = this.jobDescription.trim();
  next();
});

// Static method to create inquiry
inquirySchema.statics.createInquiry = async function (
  inquiryData: CreateInquiryInput
): Promise<IInquiry> {
  const inquiry = new this(inquiryData);
  return await inquiry.save();
};

// Instance method to update status
inquirySchema.methods.updateStatus = async function (
  newStatus: IInquiry['status']
): Promise<void> {
  this.status = newStatus;
  await this.save();
};

const Inquiry =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', inquirySchema);

export default Inquiry;
