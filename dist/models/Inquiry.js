"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var inquirySchema = new mongoose_1.Schema({
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
            message: 'Status must be one of: pending, in-progress, completed, rejected',
        },
        default: 'pending',
    },
    adminNotes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Admin notes cannot exceed 2000 characters'],
        default: '',
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Indexes for better query performance
inquirySchema.index({ email: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });
inquirySchema.index({ companyName: 1 });
// Virtual for full name
inquirySchema.virtual('fullName').get(function () {
    return "".concat(this.name);
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
inquirySchema.statics.createInquiry = function (inquiryData) {
    return __awaiter(this, void 0, void 0, function () {
        var inquiry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inquiry = new this(inquiryData);
                    return [4 /*yield*/, inquiry.save()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
// Instance method to update status
inquirySchema.methods.updateStatus = function (newStatus) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.status = newStatus;
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var Inquiry = mongoose_1.default.models.Inquiry || mongoose_1.default.model('Inquiry', inquirySchema);
exports.default = Inquiry;
