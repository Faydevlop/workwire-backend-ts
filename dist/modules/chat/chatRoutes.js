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
const express_1 = __importDefault(require("express"));
const chatModel_1 = __importDefault(require("./chatModel")); // Update with the correct path
const adminModel_1 = __importDefault(require("../admin/models/adminModel"));
const app_1 = require("../../app");
const router = express_1.default.Router();
router.get('/messages/:sender/:receiver', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sender, receiver } = req.params;
    try {
        const messages = yield chatModel_1.default.find({
            $or: [
                { sender, receiver },
                { sender: receiver, receiver: sender }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}));
router.get('/adminlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield adminModel_1.default.find();
        if (!admins) {
            res.status(200).json({ message: 'admins not fouund' });
            return;
        }
        console.log(admins);
        res.status(200).json({ admins });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch admin data' });
    }
}));
router.post('/mark-as-seen', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId } = req.body;
    try {
        yield chatModel_1.default.updateMany({ sender: senderId, receiver: receiverId, messageStatus: 'delivered' }, { seen: true }, { messageStatus: 'seen' });
        // Emit the 'messages-seen' event to the sender
        app_1.io.to(senderId).emit('messages-seen', { senderId });
        res.status(200).json({ message: 'Messages marked as seen' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update message status' });
    }
}));
exports.default = router;
