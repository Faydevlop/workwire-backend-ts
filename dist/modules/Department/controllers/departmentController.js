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
exports.deleteUser = exports.editDetails = exports.listDetails = exports.deleteDepartment = exports.showDepartments = exports.addDepartment = exports.listManager = exports.listNonDepartmentempo = void 0;
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const departmentModel_1 = __importDefault(require("../model/departmentModel"));
const projectModel_1 = __importDefault(require("../../admin/models/projectModel"));
const listNonDepartmentempo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req is here 1');
    try {
        const users = yield userModel_1.default.find({ department: null, position: 'Employee' });
        if (!users) {
            res.status(400).json({ message: 'Users not found without department' });
            return;
        }
        console.log('req is here 2');
        console.log(users.length);
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error fetching users with not department' });
    }
});
exports.listNonDepartmentempo = listNonDepartmentempo;
const listManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield userModel_1.default.find({ department: null, position: 'Manager' });
        if (!admins) {
            res.status(400).json({ message: 'admins not found' });
            return;
        }
        res.status(200).json(admins);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something broke!' });
    }
});
exports.listManager = listManager;
const addDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentName, headOfDepartment, description, email, phone, teamMembers } = req.body;
    try {
        // Create a new department
        const newDepartment = new departmentModel_1.default({
            departmentName,
            headOfDepartMent: headOfDepartment === 'null' ? null : headOfDepartment,
            description,
            email,
            phone,
            TeamMembers: teamMembers,
        });
        // Save the department to the database
        const savedDepartment = yield newDepartment.save();
        yield userModel_1.default.updateOne({ _id: headOfDepartment }, { $set: { department: savedDepartment._id } });
        yield userModel_1.default.updateMany({ _id: { $in: teamMembers } }, { $set: { department: savedDepartment._id } });
        res.status(201).json(savedDepartment);
    }
    catch (error) {
        console.error('Error adding department:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addDepartment = addDepartment;
const showDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departments = yield departmentModel_1.default.find().populate('headOfDepartMent');
        if (!departments) {
            res.status(400).json({ message: 'department not found' });
            return;
        }
        res.status(200).json(departments);
    }
    catch (error) {
        console.error('Error listing department:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.showDepartments = showDepartments;
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { departmentId } = req.params;
        const deletedDeparment = yield departmentModel_1.default.findById(departmentId);
        if (!deletedDeparment) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }
        yield userModel_1.default.updateOne({ _id: deletedDeparment.headOfDepartMent }, { $set: { department: null } });
        yield userModel_1.default.updateMany({ _id: { $in: deletedDeparment.TeamMembers } }, { $set: { department: null } });
        yield departmentModel_1.default.findByIdAndDelete(departmentId);
        res.status(200).json({ message: 'Department deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteDepartment = deleteDepartment;
const listDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { departmentId } = req.params;
        const departmentDetails = yield departmentModel_1.default.findById(departmentId)
            .populate('headOfDepartMent')
            .populate('TeamMembers');
        if (!departmentDetails) {
            res.status(400).json({ message: 'Department NOt Found' });
            return;
        }
        const projectDetails = yield projectModel_1.default.find({ department: departmentId });
        res.status(200).json({ department: departmentDetails, projects: projectDetails });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.listDetails = listDetails;
const editDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { departmentId } = req.params;
    const { departmentName, headOfDepartment, description, email, phone, teamMembers } = req.body;
    try {
        const departmentDetails = yield departmentModel_1.default.findById(departmentId);
        if (!departmentDetails) {
            res.status(400).json({ message: 'department is not found' });
            return;
        }
        departmentDetails.departmentName = departmentName;
        departmentDetails.headOfDepartMent = headOfDepartment;
        departmentDetails.description = description;
        departmentDetails.email = email;
        departmentDetails.phone = phone;
        departmentDetails.TeamMembers = teamMembers;
        yield userModel_1.default.updateMany({ _id: { $in: teamMembers } }, { $set: { department: departmentId } });
        yield departmentDetails.save();
        res.status(200).json({ message: 'department Updated success' });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.editDetails = editDetails;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('request are here');
    const { departmentId } = req.params;
    const { teamMemberIds } = req.body;
    console.log(teamMemberIds, departmentId);
    try {
        const departmentDetails = yield departmentModel_1.default.findById(departmentId);
        if (!departmentDetails) {
            res.status(200).json({ message: 'department is not working' });
            return;
        }
        const memberIndex = departmentDetails.TeamMembers.indexOf(teamMemberIds);
        if (memberIndex === -1) {
            res.status(404).json({ message: 'Team member not found in this department' });
            return;
        }
        // Remove the team member from the array
        departmentDetails.TeamMembers.splice(memberIndex, 1);
        // Save the updated department details
        yield departmentDetails.save();
        // Optionally, update the user to remove the department association if needed
        yield userModel_1.default.findByIdAndUpdate(teamMemberIds, { $unset: { department: null } }, { new: true });
        res.status(200).json({ message: 'Team member removed successfully', departmentDetails });
    }
    catch (error) {
    }
});
exports.deleteUser = deleteUser;
