import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
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

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    readTime: {
      type: String,
      required: [true, 'Read time is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '/api/placeholder/400/250',
    },
    featured: {
      type: Boolean,
      default: false,
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
blogSchema.index({ category: 1 });
blogSchema.index({ date: -1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ published: 1 });

const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;