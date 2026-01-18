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
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var db_1 = require("../lib/db");
var AdminUser_1 = require("../models/AdminUser");
var Inquiry_1 = require("../models/Inquiry");
var Event_1 = require("../models/Event");
var Feedback_1 = require("../models/Feedback");
var argon2_1 = require("argon2");
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var hashedPassword, adminUser, sampleInquiries, _i, sampleInquiries_1, inquiryData, inquiry, sampleEvents, _a, sampleEvents_1, eventData, event_1, sampleFeedback, _b, sampleFeedback_1, feedbackData, feedback, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 20, , 21]);
                    console.log('🌱 Starting database seeding...');
                    // Connect to database
                    return [4 /*yield*/, (0, db_1.default)()];
                case 1:
                    // Connect to database
                    _c.sent();
                    console.log('✅ Connected to database');
                    // Clear existing data
                    return [4 /*yield*/, AdminUser_1.default.deleteMany({})];
                case 2:
                    // Clear existing data
                    _c.sent();
                    return [4 /*yield*/, Inquiry_1.default.deleteMany({})];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, Event_1.default.deleteMany({})];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, Feedback_1.default.deleteMany({})];
                case 5:
                    _c.sent();
                    console.log('🧹 Cleared existing data');
                    return [4 /*yield*/, argon2_1.default.hash('admin123', {
                            type: argon2_1.default.argon2id,
                            memoryCost: Math.pow(2, 16),
                            timeCost: 3,
                            parallelism: 1,
                        })];
                case 6:
                    hashedPassword = _c.sent();
                    adminUser = new AdminUser_1.default({
                        email: 'admin@ai-solutions.com',
                        password: hashedPassword,
                        firstName: 'Admin',
                        lastName: 'User',
                        role: 'super-admin',
                        isActive: true,
                    });
                    return [4 /*yield*/, adminUser.save()];
                case 7:
                    _c.sent();
                    console.log('👤 Created admin user: admin@ai-solutions.com / admin123');
                    sampleInquiries = [
                        {
                            name: 'John Smith',
                            email: 'john.smith@techcorp.com',
                            phone: '+447911123456',
                            companyName: 'TechCorp Ltd',
                            country: 'United Kingdom',
                            jobTitle: 'CTO',
                            jobDescription: 'We need an AI solution to automate our customer service operations and improve response times. Our current system is manual and causing delays.',
                            status: 'pending',
                        },
                        {
                            name: 'Sarah Johnson',
                            email: 'sarah.j@healthcareplus.com',
                            phone: '+447700987654',
                            companyName: 'Healthcare Plus',
                            country: 'United Kingdom',
                            jobTitle: 'Operations Director',
                            jobDescription: 'Looking for AI-powered automation to streamline our patient appointment scheduling and reduce administrative overhead.',
                            status: 'in-progress',
                        },
                        {
                            name: 'Michael Chen',
                            email: 'm.chen@manufacturing.co.uk',
                            phone: '+447800456789',
                            companyName: 'UK Manufacturing',
                            country: 'United Kingdom',
                            jobTitle: 'Production Manager',
                            jobDescription: 'Need AI solutions for predictive maintenance and quality control in our manufacturing processes.',
                            status: 'completed',
                        },
                        {
                            name: 'Emma Wilson',
                            email: 'emma.w@retailchain.com',
                            phone: '+447600111222',
                            companyName: 'Retail Chain',
                            country: 'United Kingdom',
                            jobTitle: 'Digital Transformation Lead',
                            jobDescription: 'Seeking AI solutions for inventory management optimization and customer behavior analysis.',
                            status: 'pending',
                        },
                    ];
                    _i = 0, sampleInquiries_1 = sampleInquiries;
                    _c.label = 8;
                case 8:
                    if (!(_i < sampleInquiries_1.length)) return [3 /*break*/, 11];
                    inquiryData = sampleInquiries_1[_i];
                    inquiry = new Inquiry_1.default(inquiryData);
                    return [4 /*yield*/, inquiry.save()];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 8];
                case 11:
                    console.log("\uD83D\uDCDD Created ".concat(sampleInquiries.length, " sample inquiries"));
                    sampleEvents = [
                        {
                            title: 'Digital Employee Experience Summit 2024',
                            description: 'Join industry leaders and AI experts for two days of insights on transforming workplace productivity through AI-powered digital employee experience solutions.',
                            date: new Date('2024-04-15'),
                            location: 'Sunderland Conference Centre',
                            registrationLink: '/contact',
                            image: '/api/placeholder/600/400',
                            published: true,
                        },
                        {
                            title: 'AI-Powered Customer Service Workshop',
                            description: 'Learn how to implement AI helpdesks that reduce IT support workload by 70% while improving response times and employee satisfaction.',
                            date: new Date('2024-05-20'),
                            location: 'London Tech Hub',
                            registrationLink: '/contact',
                            image: '/api/placeholder/600/400',
                            published: true,
                        },
                        {
                            title: 'Predictive Maintenance Masterclass',
                            description: 'Discover how manufacturing companies are using AI to predict equipment failures and reduce downtime by 60% with our predictive maintenance solutions.',
                            date: new Date('2024-06-12'),
                            location: 'Manchester Innovation Center',
                            registrationLink: '/contact',
                            image: '/api/placeholder/600/400',
                            published: true,
                        },
                        {
                            title: 'Data Analytics for Retail Optimization',
                            description: 'Transform your retail operations with AI-powered inventory management and customer behavior analysis to boost sales and reduce costs.',
                            date: new Date('2024-07-08'),
                            location: 'Birmingham Business Park',
                            registrationLink: '/contact',
                            image: '/api/placeholder/600/400',
                            published: true,
                        },
                    ];
                    _a = 0, sampleEvents_1 = sampleEvents;
                    _c.label = 12;
                case 12:
                    if (!(_a < sampleEvents_1.length)) return [3 /*break*/, 15];
                    eventData = sampleEvents_1[_a];
                    event_1 = new Event_1.default(eventData);
                    return [4 /*yield*/, event_1.save()];
                case 13:
                    _c.sent();
                    _c.label = 14;
                case 14:
                    _a++;
                    return [3 /*break*/, 12];
                case 15:
                    console.log("\uD83D\uDCC5 Created ".concat(sampleEvents.length, " sample events"));
                    sampleFeedback = [
                        {
                            name: 'Dr. Sarah Mitchell',
                            email: 'sarah.m@northeast-hospital.com',
                            company: 'Northeast Regional Hospital',
                            rating: 5,
                            feedback: 'AI-Solutions transformed our patient care system beyond expectations. The AI helpdesk reduced our IT support workload by 70%, allowing our staff to focus on patient care. The implementation was smooth, and the results were immediate. Our patient satisfaction scores have never been higher.',
                            industry: 'Healthcare',
                            approved: true,
                        },
                        {
                            name: 'James Thompson',
                            email: 'j.thompson@techflow.com',
                            company: 'TechFlow Manufacturing',
                            rating: 5,
                            feedback: "The predictive maintenance system has been a game-changer for our production facility. We've reduced equipment downtime by 60% and saved over £2M annually. The AI-Solutions team understood our industry challenges and delivered exactly what we needed.",
                            industry: 'Manufacturing',
                            approved: true,
                        },
                        {
                            name: 'Emma Rodriguez',
                            email: 'e.rodriguez@global-retail.com',
                            company: 'Global Retail Solutions',
                            rating: 5,
                            feedback: 'Implementing AI-Solutions\' inventory management system transformed our supply chain. We reduced stockouts by 85% and improved our forecasting accuracy by 92%. The ROI was evident within the first quarter.',
                            industry: 'Retail',
                            approved: true,
                        },
                    ];
                    _b = 0, sampleFeedback_1 = sampleFeedback;
                    _c.label = 16;
                case 16:
                    if (!(_b < sampleFeedback_1.length)) return [3 /*break*/, 19];
                    feedbackData = sampleFeedback_1[_b];
                    feedback = new Feedback_1.default(feedbackData);
                    return [4 /*yield*/, feedback.save()];
                case 17:
                    _c.sent();
                    _c.label = 18;
                case 18:
                    _b++;
                    return [3 /*break*/, 16];
                case 19:
                    console.log("\uD83D\uDCAC Created ".concat(sampleFeedback.length, " sample feedback entries"));
                    console.log('🎉 Database seeding completed successfully!');
                    console.log('\n📋 Login Credentials:');
                    console.log('Email: admin@ai-solutions.com');
                    console.log('Password: admin123');
                    console.log('\n🔗 Admin Panel: http://localhost:3000/admin');
                    return [3 /*break*/, 21];
                case 20:
                    error_1 = _c.sent();
                    console.error('❌ Seeding failed:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 21];
                case 21: return [2 /*return*/];
            }
        });
    });
}
// Run seeding if called directly
if (require.main === module) {
    seed()
        .then(function () {
        console.log('✅ Seeding script finished');
        process.exit(0);
    })
        .catch(function (error) {
        console.error('❌ Seeding script failed:', error);
        process.exit(1);
    });
}
exports.default = seed;
