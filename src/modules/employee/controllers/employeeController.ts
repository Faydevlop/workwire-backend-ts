import { Request, Response } from "express";
import User from "../models/userModel";
import path from "path";
import Jwt from "jsonwebtoken";
import sendRestlink from "../middlewares/resetPass";
import bcrypt from "bcrypt";
import { Meeting } from "../../meetings/model/MeetingModal";
import taskModel from "../../TaskManagement/models/taskModel";
import Payroll from "../../PayrollManagement/models/payrollModel";
import Leave from "../../leaveManagement/models/leaveModel";

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update user fields
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.dob = req.body.dob || user.dob;
    user.phone = req.body.phone || user.phone;
    user.gender = req.body.gender || user.gender;
    user.address = req.body.address || user.address;

    // Update profile image if it exists
    if (req.file) {
      // Cloudinary will have already handled the upload at this point
      // The URL of the uploaded image is available in `req.file.path` (after multer processes it)
      const uploadedImageUrl = req.file.path;
      
      // Save the Cloudinary URL to the user's profile image field
      user.profileImageUrl = uploadedImageUrl;
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const resetPassRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    const existUser = await User.findById(userId);

    if (!existUser) {
      res.status(401).json({ message: "User Not Found" });
      return;
    }

    const token = Jwt.sign({ userId: existUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    const resetLink = `${process.env.FRONTENDAPI}/employee/reset-password?token=${token}`;

    await sendRestlink(existUser.email, resetLink);

    res.status(201).json({ message: "Verification Link sent Success" });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const ChangePassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: "invalid request" });
    }

    const decode: any = Jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = decode.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const dashboardData = async (req: Request, res: Response): Promise<void> => {
  console.log('dashboard data req is here');
  
  try {
    const { userId } = req.params;


    // Fetch upcoming meetings (meetings scheduled for the future)
    const upcomingMeetings = await Meeting.find({
      participants: userId,
      date: { $gte: new Date() }, // Filter by future meetings
      status: 'scheduled'
    });

    // Fetch tasks assigned to the user
    const tasks = await taskModel.find({
      assignedTo: userId,
    
    });

    // Fetch payroll data for the user
    const payrollData = await Payroll.find({
      employee: userId
    });

    // Fetch leave requests for the user
    const leaveRequests = await Leave.find({
      userId: userId
    });

    // Send the aggregated data as the response
    res.status(200).json({
      upcomingMeetings,
      tasks,
      payrollData,
      leaveRequests
    });


    
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
