"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Meeting = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Create the Meeting schema
const MeetingSchema = new mongoose_1.Schema({
    meetingName: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Storing time as a string
    participants: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Participant', }],
    topic: { type: String, required: true },
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled',
    },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    link: { type: String, required: true }, // New field for the meeting link
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});
// Export the Meeting model 
exports.Meeting = (0, mongoose_1.model)('Meeting', MeetingSchema);
