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
exports.adminLogin = exports.adminSignup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminModel_1 = __importDefault(require("../models/adminModel"));
const jwt_1 = require("../../../middlewares/jwt");
const adminSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("request is here");
        const { username, email, password } = req.body;
        const existingUser = yield adminModel_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "Admin already exists. Please login." });
            return;
        }
        const hashedpassword = yield bcrypt_1.default.hash(password, 12);
        const newAdmin = new adminModel_1.default({
            username,
            email,
            password: hashedpassword,
        });
        yield newAdmin.save();
        const accessToken = (0, jwt_1.generateAccessToken)(newAdmin._id); // Corrected here
        console.log('accessToken is here', accessToken);
        const refreshToken = jsonwebtoken_1.default.sign({ userId: newAdmin._id }, process.env.JWT_REFRESH_SECRET || 'workwise', { expiresIn: '7d' });
        res.status(201).json({ accessToken, refreshToken, admin: newAdmin });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.adminSignup = adminSignup;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req is here");
        const { email, password } = req.body;
        const user = yield adminModel_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User Not found Please login" });
            return;
        }
        const passMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passMatch) {
            res.status(400).json({ message: "Wrong Password" });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user._id); // Corrected here
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET || 'workwise', { expiresIn: '7d' });
        // Set refresh token in HTTP-only cookie
        res.status(200).json({ accessToken, refreshToken, admin: user });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred during login" });
    }
});
exports.adminLogin = adminLogin;
