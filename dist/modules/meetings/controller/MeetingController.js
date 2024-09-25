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
exports.includedMeetingList = exports.listingallUser = exports.updateMeeting = exports.listforEdit = exports.meetinglist = exports.nextmeet = exports.deleteMeeting = exports.listUser = exports.findusers = exports.createMeeting = void 0;
const MeetingModal_1 = require("../model/MeetingModal");
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const moment_1 = __importDefault(require("moment"));
const notificationModel_1 = __importDefault(require("../../notification/model/notificationModel"));
const app_1 = require("../../../app");
const createMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const { meetingName, date, participants, topic, meetingLink, time } = req.body;
        if (!meetingName || !date || !participants || !topic || !meetingLink || !time) {
            res.status(400).json({ message: 'Please fill all the required forms' });
            return;
        }
        // Convert time to 24-hour format if it's in 12-hour format with AM/PM
        let formattedTime = time;
        if (time.match(/(AM|PM)$/i)) {
            const [timePart, modifier] = time.split(" ");
            let [hours, minutes] = timePart.split(":").map(Number);
            if (modifier.toUpperCase() === "PM" && hours < 12) {
                hours += 12;
            }
            else if (modifier.toUpperCase() === "AM" && hours === 12) {
                hours = 0;
            }
            formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        }
        const newMeeting = new MeetingModal_1.Meeting({
            meetingName,
            date,
            participants,
            topic,
            link: meetingLink,
            createdBy: userId,
            time: formattedTime
        });
        yield newMeeting.save();
        for (const participant of participants) {
            const newNotification = new notificationModel_1.default({
                sender: userId,
                receiver: participant,
                type: 'message',
                message: `You have been invited to a meeting: ${meetingName} on ${date} at ${formattedTime}.`,
            });
            yield newNotification.save();
            app_1.io.to(participant).emit('newNotification', newNotification);
        }
        res.status(200).json({ message: 'Meeting Scheduled Successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Meeting Schedule Error', error });
    }
});
exports.createMeeting = createMeeting;
const findusers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const managerdetails = yield userModel_1.default.findById(userId);
        const users = yield userModel_1.default.find({ department: managerdetails === null || managerdetails === void 0 ? void 0 : managerdetails.department });
        if (!managerdetails || !userId) {
            res.status(400).json({ message: 'Error fetching details of user' });
            return;
        }
        res.status(200).json({ users });
    }
    catch (error) {
        res.status(500).json({ message: 'Meeting Scheduled error', error });
    }
});
exports.findusers = findusers;
const listUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const meetingDetails = yield MeetingModal_1.Meeting.find({ createdBy: userId });
        if (!meetingDetails) {
            res.status(400).json({ message: 'meeting not found' });
            return;
        }
        res.status(200).json({ listData: meetingDetails });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});
exports.listUser = listUser;
const deleteMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { meetingId } = req.params;
        const deleteMeeting = yield MeetingModal_1.Meeting.findByIdAndDelete(meetingId);
        if (!deleteMeeting) {
            res.status(400).json({ message: 'Meeting deleted unsuccessfull' });
            return;
        }
        res.status(200).json({ message: 'meeting deleted successfull' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});
exports.deleteMeeting = deleteMeeting;
const nextmeet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = (0, moment_1.default)();
        // Parse the current date and time for better comparison
        const currentDate = now.startOf('day').toDate();
        const currentTime = now.format('HH:mm');
        // Find all meetings that are scheduled for the future, sorted by date and time
        const upcomingMeetings = yield MeetingModal_1.Meeting.find({
            $or: [
                {
                    date: { $gt: currentDate }, // Meetings after today
                },
                {
                    date: currentDate,
                    time: { $gte: currentTime }, // Meetings today but after the current time
                    status: 'scheduled',
                }
            ]
        })
            .sort({ date: 1, time: 1 }); // Sort by date and then by time
        if (upcomingMeetings.length === 0) {
            res.status(400).json({ message: 'No upcoming meetings found' });
            return;
        }
        // Return the list of upcoming meetings
        res.status(200).json({ upcomingMeetings });
    }
    catch (error) {
        console.error('Error fetching the upcoming meetings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.nextmeet = nextmeet;
const meetinglist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const listingData = yield MeetingModal_1.Meeting.find({ participants: { $in: [userId] } });
        if (!listingData) {
            res.status(400).json({ message: "message Not found" });
            return;
        }
        res.status(200).json({ data: listingData });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.meetinglist = meetinglist;
const listforEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('list req is here');
    try {
        const { meetingId } = req.params;
        const meetdetails = yield MeetingModal_1.Meeting.findById(meetingId);
        if (!meetdetails) {
            res.status(400).json({ message: 'meeting details not found' });
            return;
        }
        res.status(200).json({ meetingData: meetdetails });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.listforEdit = listforEdit;
const updateMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { meetId } = req.params;
        const { meetingName, date, participants, meetingLink, topic, time } = req.body;
        // Fetch the existing meeting details
        const existingMeeting = yield MeetingModal_1.Meeting.findById(meetId);
        if (!existingMeeting) {
            res.status(404).json({ message: 'Meeting not found' });
            return;
        }
        // Create an object to store the fields to update
        const updatedFields = {
            meetingName,
            date,
            meetingLink,
            topic,
            time,
        };
        // Only update participants if new participants are provided
        if (participants && participants.length > 0) {
            updatedFields.participants = participants;
        }
        // Update the meeting details
        const updatedMeeting = yield MeetingModal_1.Meeting.findByIdAndUpdate(meetId, updatedFields, { new: true } // return the updated document
        );
        res.status(200).json({ message: 'Meeting updated successfully', meetingData: updatedMeeting });
    }
    catch (error) {
        console.error('Error updating meeting:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateMeeting = updateMeeting;
const listingallUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUser = yield userModel_1.default.find();
        if (!allUser) {
            res.status(400).json({ message: 'no users found' });
            return;
        }
        res.status(200).json({ users: allUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.listingallUser = listingallUser;
const includedMeetingList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const meetings = yield MeetingModal_1.Meeting.find({
            $or: [
                { createdBy: userId },
                { participants: { $in: [userId] } }
            ]
        });
        if (!meetings) {
            res.status(400).json({ message: 'Not Meetings Found' });
            return;
        }
        res.status(200).json({ meetings });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.includedMeetingList = includedMeetingList;
