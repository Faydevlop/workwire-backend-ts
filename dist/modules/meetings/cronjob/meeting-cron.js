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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const MeetingModal_1 = require("../model/MeetingModal"); // Adjust the import path as needed
// Function to check and update meeting statuses
const checkMeetingsStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the current date and time
        const now = new Date();
        // Find meetings that are scheduled but should be ongoing
        const meetingsToUpdate = yield MeetingModal_1.Meeting.find({
            status: 'scheduled',
            date: { $lte: now },
            time: { $lte: now.toTimeString().slice(0, 5) }, // Matches "HH:mm" format
        });
        // Update the status of the matched meetings to 'ongoing'
        for (const meeting of meetingsToUpdate) {
            meeting.status = 'ongoing';
            // Check if the meeting is valid before saving
            const validationError = meeting.validateSync();
            if (!validationError) {
                yield meeting.save();
                console.log(`Meeting "${meeting.meetingName}" status updated to "ongoing".`);
            }
            else {
                console.warn(`Meeting "${meeting.meetingName}" has validation errors and was not updated:`, validationError);
            }
        }
        // Find meetings that are ongoing and should be marked as completed
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
        const meetingsToComplete = yield MeetingModal_1.Meeting.find({
            status: 'ongoing',
            date: { $lte: oneHourAgo },
            time: { $lte: oneHourAgo.toTimeString().slice(0, 5) }, // Matches "HH:mm" format
        });
        // Update the status of the matched meetings to 'completed'
        for (const meeting of meetingsToComplete) {
            meeting.status = 'completed';
            // Check if the meeting is valid before saving
            const validationError = meeting.validateSync();
            if (!validationError) {
                yield meeting.save();
                console.log(`Meeting "${meeting.meetingName}" status updated to "completed".`);
            }
            else {
                console.warn(`Meeting "${meeting.meetingName}" has validation errors and was not updated:`, validationError);
            }
        }
    }
    catch (error) {
        console.error('Error updating meeting statuses:', error);
    }
});
// Cron job that runs every minute
node_cron_1.default.schedule('* * * * *', checkMeetingsStatus);
