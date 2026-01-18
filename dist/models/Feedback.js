"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var feedbackSchema = new mongoose_1.Schema({
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
        maxlength: [150, 'Email cannot exceed 150 characters'],
    },
    company: {
        type: String,
        required: [true, 'Company is required'],
        trim: true,
        maxlength: [150, 'Company cannot exceed 150 characters'],
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
    },
    feedback: {
        type: String,
        required: [true, 'Feedback is required'],
        minlength: [10, 'Feedback must be at least 10 characters'],
        maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
    },
    industry: {
        type: String,
        required: [true, 'Industry is required'],
        trim: true,
        maxlength: [100, 'Industry cannot exceed 100 characters'],
    },
    approved: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Indexes for better query performance
feedbackSchema.index({ approved: 1 });
feedbackSchema.index({ rating: -1 });
feedbackSchema.index({ createdAt: -1 });
var Feedback = mongoose_1.default.models.Feedback || mongoose_1.default.model('Feedback', feedbackSchema);
exports.default = Feedback;
