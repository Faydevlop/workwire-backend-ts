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
exports.listTasks = exports.projectlisting = exports.deleteProject = exports.editProject = exports.getprojectdetails = exports.listProjects = exports.addNewProject = void 0;
const projectModel_1 = __importDefault(require("../models/projectModel"));
const departmentModel_1 = __importDefault(require("../../Department/model/departmentModel"));
const taskModel_1 = __importDefault(require("../../TaskManagement/models/taskModel"));
const projectModel_2 = __importDefault(require("../models/projectModel"));
const addNewProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, status, startDate, endDate, priority, description, sdepartment, } = req.body;
    try {
        const existProject = yield projectModel_2.default.find({ name: name });
        if (existProject) {
            res.status(400).json({ message: 'Duplicate Project is Found' });
            return;
        }
        const newProject = new projectModel_1.default({
            name,
            status,
            startDate,
            endDate,
            priority,
            description,
            department: sdepartment || undefined,
        });
        yield newProject.save();
        res.status(201).json({ message: "Project created successfully" });
    }
    catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Error creating project" });
    }
});
exports.addNewProject = addNewProject;
const listProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield projectModel_1.default.find();
        if (!projects) {
            res.status(400).json({ message: "No Project Found" });
            return;
        }
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(400).json({ message: "Error fetching projects" });
    }
});
exports.listProjects = listProjects;
const getprojectdetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const projectdetails = yield projectModel_1.default.findById(projectId).populate('department');
        if (!projectdetails) {
            res.status(400).json({ message: "project details not found" });
            return;
        }
        res.status(200).json(projectdetails);
    }
    catch (error) { }
});
exports.getprojectdetails = getprojectdetails;
const editProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    const { name, status, startDate, endDate, priority, description, sdepartment } = req.body;
    try {
        const projectdetails = yield projectModel_1.default.findById(projectId);
        if (!projectdetails) {
            res.status(400).json({ message: "Project not found" });
            return;
        }
        projectdetails.name = name;
        projectdetails.status = status;
        projectdetails.startDate = startDate;
        projectdetails.endDate = endDate;
        projectdetails.priority = priority;
        projectdetails.description = description;
        projectdetails.department = sdepartment;
        // projectdetails.teamLead = teamLead;
        // projectdetails.teamMates = teamMates;
        yield projectdetails.save();
        res.status(200).json({ message: "Project updated successfully" });
    }
    catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.editProject = editProject;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectId } = req.params;
    console.log('delete project request is here', projectId);
    try {
        const projectdetails = yield projectModel_1.default.findById(projectId);
        if (!projectdetails) {
            res.status(400).json({ message: 'Project not found' });
            return;
        }
        yield projectModel_1.default.findByIdAndDelete(projectId);
        res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteProject = deleteProject;
const projectlisting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { managerId } = req.params;
        const department = yield departmentModel_1.default.findOne({ headOfDepartMent: managerId });
        if (!department) {
            res.status(400).json({ message: 'Department Not found' });
            return;
        }
        const projectDetails = yield projectModel_1.default.find({ department: department._id }).populate('department');
        if (!projectDetails) {
            res.status(400).json({ message: 'project details not found' });
            return;
        }
        // Fetch tasks for each project
        const projectIds = projectDetails.map(p => p._id);
        const tasks = yield taskModel_1.default.find({ projectId: { $in: projectIds } }).populate('projectId');
        res.status(200).json({ projectDetails, tasks });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.projectlisting = projectlisting;
const listTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const tasks = yield taskModel_1.default.find({ projectId: projectId });
        if (!tasks) {
            res.status(400).json({ message: 'no tasks found' });
            return;
        }
        res.status(200).json({ tasks });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.listTasks = listTasks;
