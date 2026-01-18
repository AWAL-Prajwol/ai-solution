import mongoose, { Schema, Document } from 'mongoose';
import { IAdminUser, CreateAdminUserInput } from '@/types';

const adminUserSchema = new Schema<IAdminUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'super-admin'],
        message: 'Role must be either admin or super-admin',
      },
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
// Removed duplicate email index because 'unique: true' already creates it
adminUserSchema.index({ role: 1 });
adminUserSchema.index({ isActive: 1 });

// Virtual for full name
adminUserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware for data cleaning
adminUserSchema.pre('save', function (next) {
  this.firstName = this.firstName.trim();
  this.lastName = this.lastName.trim();
  next();
});

// Static method to create admin user
adminUserSchema.statics.createAdminUser = async function (
  adminData: CreateAdminUserInput
): Promise<IAdminUser> {
  const adminUser = new this(adminData);
  return await adminUser.save();
};

// Instance method to update last login
adminUserSchema.methods.updateLastLogin = async function (): Promise<void> {
  this.lastLogin = new Date();
  await this.save();
};

// Instance method to deactivate account
adminUserSchema.methods.deactivate = async function (): Promise<void> {
  this.isActive = false;
  await this.save();
};

const AdminUser =
  mongoose.models.AdminUser ||
  mongoose.model<IAdminUser>('AdminUser', adminUserSchema);

export default AdminUser;
