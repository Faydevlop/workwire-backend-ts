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
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS,
    },
});
const sendVerificationmail = (userEmail, randomPass, role) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: "workwiseoffice@gmail.com", // Sender address
        to: `${userEmail}`, // Replace with the new employee's email address
        subject: "Welcome to Workwise - Your Temporary Password", // Subject line
        text: `Hello,

        Welcome to Workwise!
        
        Your temporary password is: ${randomPass}
        
        Please use this [link to log in](${process.env.FRONTENDAPI}/${role}/login) to access your dashboard.
        
        Please use this password to log in and then update it to something more secure once you’re logged in.
        
        If you have any questions or need further assistance, feel free to reach out to our support team.
        
        Best regards,
        The Workwise Team`,
        html: `
        <p>Hello,</p>
        <p>Welcome to <strong>Workwise</strong>!</p>
        <p>Your temporary password is: <strong>${randomPass}</strong></p>
        <p>Please use this <a href="${process.env.FRONTENDAPI}/${role}/login">link to log in</a> to access your dashboard.</p>
        <p>Please use this password to log in and then update it to something more secure once you’re logged in.</p>
        <p>If you have any questions or need further assistance, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Workwise Team</p>
      `,
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log("Message sent successfully", info.messageId);
    }
    catch (error) {
        console.error("Verification mail send failed", error);
    }
});
exports.default = sendVerificationmail;
