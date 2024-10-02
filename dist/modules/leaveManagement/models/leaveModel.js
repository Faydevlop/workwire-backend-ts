"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Create the Leave schema
const LeaveSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User', // Reference to the Employee model
        required: true,
    },
    leaveType: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'], // Example status values
        default: 'Pending'
    },
    monthlyLeaveCount: {
        type: Number,
        default: 0, // Initial leave count is 0
    },
    lastResetDate: {
        type: Date,
        default: Date.now, // Initialize with the current date
    },
    comment: {
        type: String, // Field to store admin's comment
        default: '', // Default is an empty string if no comment is provided
    },
    reason: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the current date
    },
    isChanged: {
        type: Boolean, // Field to store admin's comment
        default: false, // Default is an empty string if no comment is provided
    },
});
// Create and export the Leave model
const Leave = (0, mongoose_1.model)('Leave', LeaveSchema);
exports.default = Leave;
