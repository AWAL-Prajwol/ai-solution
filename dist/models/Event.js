"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var eventSchema = new mongoose_1.Schema({
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
        default: '/api/placeholder/400/250',
    },
    published: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Indexes for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ published: 1 });
var Event = mongoose_1.default.models.Event || mongoose_1.default.model('Event', eventSchema);
exports.default = Event;
