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
exports.updatestatus = exports.listComments = exports.createComment = void 0;
const commentsModel_1 = __importDefault(require("../models/commentsModel"));
const taskModel_1 = __importDefault(require("../models/taskModel"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    const { commentedBy, comment } = req.body;
    try {
        if (!commentedBy || !comment) {
            res.status(400).json({ message: "Please fill all the forms" });
            return;
        }
        const newComment = new commentsModel_1.default({
            commentedBy: commentedBy,
            comment: comment,
            taskId: taskId
        });
        yield newComment.save();
        res.status(200).json({ message: 'Comment Added Succesfull' });
    }
    catch (error) {
    }
});
exports.createComment = createComment;
const listComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    try {
        const comments = yield commentsModel_1.default.find({ taskId: taskId })
            .populate('commentedBy');
        if (!comments) {
            res.status(400).json({ message: 'No Comments' });
            return;
        }
        res.status(200).json({ comments });
    }
    catch (error) {
    }
});
exports.listComments = listComments;
const updatestatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        try {
            // Validate input
            if (!status || !['Pending', 'InProgress', 'Completed'].includes(status)) {
                res.status(400).json({ message: 'Invalid status' });
                return;
            }
            // Update the task status
            const updatedTask = yield taskModel_1.default.findByIdAndUpdate(id, { status }, { new: true } // Return the updated task
            );
            if (!updatedTask) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }
            // Send the updated task back to the client
            res.status(200).json(updatedTask);
        }
        catch (error) {
            console.error('Error updating task status:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
    catch (error) {
    }
});
exports.updatestatus = updatestatus;
