import mongoose, { Schema, Document } from 'mongoose';

export interface ICaseStudy extends Document {
  clientName: string;
  projectTitle: string;
  content: string;
  results: string;
  industry: string;
  duration: string;
  technologies: string[];
  image: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const caseStudySchema = new Schema<ICaseStudy>(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      maxlength: [100, 'Client name cannot exceed 100 characters'],
    },
    projectTitle: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [200, 'Project title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    results: {
      type: String,
      required: [true, 'Results are required'],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      type: String,
      default: '/api/placeholder/400/250',
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
caseStudySchema.index({ industry: 1 });
caseStudySchema.index({ published: 1 });

const CaseStudy =
  mongoose.models.CaseStudy || mongoose.model<ICaseStudy>('CaseStudy', caseStudySchema);

export default CaseStudy;