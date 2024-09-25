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
exports.listTasks = exports.taskdetails = exports.listUsers = exports.CreateTask = void 0;
const taskModel_1 = __importDefault(require("../models/taskModel"));
const projectModel_1 = __importDefault(require("../../admin/models/projectModel"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const CreateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('task create reqeust is here');
    const { ProjectId } = req.params;
    const { taskTitle, status, assignedTo, priority, startDate, dueDate, description } = req.body;
    try {
        const isProjectExist = yield projectModel_1.default.findById(ProjectId);
        if (!isProjectExist) {
            res.status(200).json({ message: 'Project not found' });
            return;
        }
        const newTask = new taskModel_1.default({
            projectId: ProjectId,
            name: taskTitle,
            description: description,
            status: status,
            dueDate: dueDate,
            assignedTo: assignedTo,
            createdAt: startDate,
            priority: priority,
        });
        yield newTask.save();
        res.status(200).json({ message: 'task created successfully' });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating project" });
    }
});
exports.CreateTask = CreateTask;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('user list request is here');
    try {
        const { ProjectId } = req.params;
        const projectDetails = yield projectModel_1.default.findById(ProjectId);
        if (!projectDetails) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        const userDetails = yield userModel_1.default.find({ department: projectDetails.department, position: 'Employee' });
        if (!userDetails) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }
        res.status(200).json({ users: userDetails });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.listUsers = listUsers;
const taskdetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.params;
        const taskDetails = yield taskModel_1.default.findById(taskId).populate('assignedTo');
        if (!taskDetails) {
            res.status(400).json({ message: 'Task is not found' });
            return;
        }
        res.status(200).json({ task: taskDetails });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});
exports.taskdetails = taskdetails;
const listTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeId } = req.params;
        // Find tasks where the employee is assigned
        const tasks = yield taskModel_1.default.find({ assignedTo: employeeId })
            .populate('projectId') // Populate project details if needed
            .populate('assignedTo') // Populate user details if needed
            .populate('comments'); // Populate comments details if needed
        // Send the tasks as a response
        res.status(200).json(tasks);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
});
exports.listTasks = listTasks;
