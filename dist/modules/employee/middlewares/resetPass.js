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
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS
    }
});
const sendRestlink = (userEmail, resetLink) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        to: userEmail,
        from: 'workwiseoffice@gmail.com',
        subject: 'Password Reset',
        text: `Click the link to reset your password: ${resetLink}`,
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log('Message sent successfully', info.messageId);
    }
    catch (error) {
        console.error('Verification mail send failed', error);
    }
});
exports.default = sendRestlink;
