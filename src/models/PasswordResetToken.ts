import mongoose, { Schema, Document } from 'mongoose';
import { IPasswordResetToken } from '@/types';

const passwordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
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
    token: {
      type: String,
      required: [true, 'Token is required'],
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
      index: { expireAfterSeconds: 0 }, // TTL index to automatically delete expired tokens
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
passwordResetTokenSchema.index({ email: 1 });
passwordResetTokenSchema.index({ token: 1 });
passwordResetTokenSchema.index({ expiresAt: 1 });

// Static method to create reset token
passwordResetTokenSchema.statics.createResetToken = async function (
  email: string,
  token: string,
  expiresInHours: number = 1
): Promise<IPasswordResetToken> {
  // Delete any existing tokens for this email
  await this.deleteMany({ email });

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  const resetToken = new this({
    email,
    token,
    expiresAt,
  });

  return await resetToken.save();
};

// Static method to find valid token
passwordResetTokenSchema.statics.findValidToken = async function (
  token: string
): Promise<IPasswordResetToken | null> {
  return await this.findOne({
    token,
    used: false,
    expiresAt: { $gt: new Date() },
  });
};

// Instance method to mark token as used
passwordResetTokenSchema.methods.markAsUsed = async function (): Promise<void> {
  this.used = true;
  await this.save();
};

const PasswordResetToken =
  mongoose.models.PasswordResetToken ||
  mongoose.model<IPasswordResetToken>(
    'PasswordResetToken',
    passwordResetTokenSchema
  );

export default PasswordResetToken;
