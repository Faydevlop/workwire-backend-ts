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
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    phone: { type: Number, required: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    department: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Department", // Refers to the Department model
        default: null
    },
    position: { type: String, required: true },
    dateOfJoining: { type: Date, required: true },
    payroll: { type: mongoose_1.Schema.Types.ObjectId, ref: "Payroll", default: null },
    employeeStatus: { type: String, required: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, default: null },
    projectAssigned: { type: Boolean, default: false },
});
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
