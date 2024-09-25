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
exports.eachUserNotification = exports.getUsersSortedByLastMessage = exports.checkNotification = exports.createNotification = void 0;
const notificationModel_1 = __importDefault(require("../model/notificationModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const chatModel_1 = __importDefault(require("../../chat/chatModel"));
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId, roomId } = req.body;
    try {
        // Create a new notification in the database
        const newNotification = new notificationModel_1.default({
            sender: senderId,
            receiver: receiverId,
            type: 'video-call',
            roomId: roomId,
            timestamp: new Date()
        });
        yield newNotification.save();
        res.status(200).json({ message: 'Video call notification sent!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to send video call notification' });
    }
});
exports.createNotification = createNotification;
const checkNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    // console.log('notificaion req is here');
    try {
        // Find the notification for the user that hasn't been marked as sent
        const notifications = yield notificationModel_1.default.find({
            receiver: userId,
            isNotificationSend: false
        });
        res.status(200).json(notifications);
        // If there are notifications, mark them as sent
        if (notifications.length > 0) {
            yield notificationModel_1.default.updateMany({ receiver: userId, isNotificationSend: false }, { $set: { isNotificationSend: true } });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
exports.checkNotification = checkNotification;
const getUsersSortedByLastMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currentUserId } = req.params;
        // Fetch users who have exchanged messages with the current user
        const latestMessages = yield chatModel_1.default.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose_1.default.Types.ObjectId(currentUserId) },
                        { receiver: new mongoose_1.default.Types.ObjectId(currentUserId) }
                    ]
                }
            },
            {
                $sort: { timestamp: -1 } // Sort by latest messages first
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", new mongoose_1.default.Types.ObjectId(currentUserId)] },
                            "$receiver",
                            "$sender"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" } // Capture the first (most recent) message for each user
                }
            }
        ]);
        // Extract user IDs from the aggregation result
        const userIdsWithMessages = latestMessages.map((message) => message._id);
        // Fetch user details for those who have exchanged messages
        let usersWithMessages = yield userModel_1.default.find({ _id: { $in: userIdsWithMessages } });
        // Also fetch all other users who haven't exchanged messages yet
        let usersWithoutMessages = yield userModel_1.default.find({
            _id: { $nin: [new mongoose_1.default.Types.ObjectId(currentUserId), ...userIdsWithMessages] }
        });
        // Combine both sets of users, placing those with recent messages on top
        let allUsers = [
            ...usersWithMessages, // Users with messages (sorted by most recent)
            ...usersWithoutMessages // Users without any message interaction
        ];
        console.log('Full Users List:', allUsers);
        // Return the users list in the response
        res.status(200).json({ users: allUsers });
    }
    catch (error) {
        console.error("Error fetching users sorted by last message:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
});
exports.getUsersSortedByLastMessage = getUsersSortedByLastMessage;
const eachUserNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log('notification req is here');
        const allnotifications = yield notificationModel_1.default.find({ receiver: userId, type: 'message' });
        if (!allnotifications) {
            res.status(400).json({ message: 'No Notifications' });
            return;
        }
        res.status(200).json({ notifications: allnotifications });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});
exports.eachUserNotification = eachUserNotification;
