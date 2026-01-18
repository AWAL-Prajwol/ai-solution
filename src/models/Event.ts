import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
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

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    registrationLink: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: '/api/placeholder/600/400',
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ published: 1 });

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;