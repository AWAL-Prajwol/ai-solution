import mongoose, { Schema, Document } from 'mongoose';

export interface IOTPToken extends Document {
  email: string;
  otpHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const otpTokenSchema = new Schema<IOTPToken>({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // Auto-delete expired tokens
  },
  used: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
otpTokenSchema.index({ email: 1, used: 1 });

export default mongoose.models.OTPToken ||
  mongoose.model<IOTPToken>('OTPToken', otpTokenSchema);
