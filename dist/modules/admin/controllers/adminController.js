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
exports.adminDashboard = exports.deleteUser = exports.updateUser = exports.getSpecificUser = exports.getAllUsers = exports.AddUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = __importDefault(require("../../employee/models/userModel"));
const mailVerification_1 = __importDefault(require("../middlewares/mailVerification"));
const leaveModel_1 = __importDefault(require("../../leaveManagement/models/leaveModel"));
const departmentModel_1 = __importDefault(require("../../Department/model/departmentModel"));
const payrollModel_1 = __importDefault(require("../../PayrollManagement/models/payrollModel"));
const projectModel_1 = __importDefault(require("../models/projectModel"));
function generateRandomPassword(length = 12) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}
const AddUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("add user request is here");
        const { firstName, lastName, email, dob, phone, gender, address, 
        // department,
        position, dateOfJoining, employeeStatus, } = req.body;
        const existUser = yield userModel_1.default.findOne({ email });
        if (existUser) {
            res.status(400).json({ message: "User already Exists In this Email" });
            return;
        }
        const randomPass = generateRandomPassword();
        const hashedPassword = yield bcrypt_1.default.hash(randomPass, 10);
        const newUser = new userModel_1.default({
            firstName,
            lastName,
            email,
            dob,
            phone,
            gender,
            address,
            profileImageUrl: `https://i.pinimg.com/564x/00/80/ee/0080eeaeaa2f2fba77af3e1efeade565.jpg`,
            // department,
            position,
            dateOfJoining,
            employeeStatus,
            password: hashedPassword,
        });
        yield (0, mailVerification_1.default)(email, randomPass, req.body.position);
        console.log('Password:', randomPass);
        yield newUser.save();
        res
            .status(201)
            .json({ message: "User created successfully , Email verification sent" });
    }
    catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.AddUser = AddUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userModel_1.default.find().populate('department');
        if (!allUsers) {
            res.status(400).json({ message: "Users collection is empty" });
            return;
        }
        res.status(201).json({ allUsers });
    }
    catch (error) {
        res.status(400).json({ message: "Somthing went Wrong" });
    }
});
exports.getAllUsers = getAllUsers;
const getSpecificUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("specific user request is here");
    const { userId } = req.params;
    try {
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(400).json({ message: "User Nor found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getSpecificUser = getSpecificUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userModel_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.dob = req.body.dob || user.dob;
        user.phone = req.body.phone || user.phone;
        user.gender = req.body.gender || user.gender;
        user.address = req.body.address || user.address;
        // user.department = req.body.department || user.department;
        user.position = req.body.position || user.position;
        user.dateOfJoining = req.body.dateOfJoining || user.dateOfJoining;
        user.employeeStatus = req.body.employeeStatus || user.employeeStatus;
        const updatedUser = yield user.save();
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield userModel_1.default.findByIdAndDelete(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User delete sucessfull" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.deleteUser = deleteUser;
const adminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('req is here');
        const leaves = yield leaveModel_1.default.find({ status: 'Pending' }).populate('userId');
        const department = yield departmentModel_1.default.find();
        const payroll = yield payrollModel_1.default.find().populate('employee');
        const projects = yield projectModel_1.default.find().populate('department');
        console.log(leaves, department, payroll, projects);
        res.status(200).json({ leaves, department, payroll, projects });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
});
exports.adminDashboard = adminDashboard;
