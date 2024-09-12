import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel";
import { generateAccessToken, generateRefreshToken } from '../../../middlewares/jwt';


// defining interfaces for request body
interface AdminSignupBody {
  username: string;
  email: string;
  password: string;
}

interface AdminLoginBody {
  email: string;
  password: string;
}

export const adminSignup = async (
  req: Request<{}, {}, AdminSignupBody>,
  res: Response
): Promise<void> => {
  try {
    console.log("request is here");
    const { username, email, password } = req.body;

    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Admin already exists. Please login." });
      return;
    }

    const hashedpassword = await bcrypt.hash(password, 12);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedpassword,
    });

    await newAdmin.save();

    const accessToken = generateAccessToken(newAdmin._id);  // Corrected here
    console.log('accessToken is here',accessToken);
    
    const refreshToken = jwt.sign(
      { userId: newAdmin._id },
      process.env.JWT_REFRESH_SECRET! || 'workwise', 
      { expiresIn: '7d' }
    );

    res.status(201).json({ accessToken,refreshToken, admin: newAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminLogin = async (
  req: Request<{}, {}, AdminLoginBody>,
  res: Response
): Promise<void> => {
  try {
    console.log("req is here");

    const { email, password } = req.body; 
    const user = await Admin.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User Not found Please login" });
      return;
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch) {
      res.status(400).json({ message: "Wrong Password" });
      return;
    }

    const accessToken = generateAccessToken(user._id);  // Corrected here
    
    
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET! || 'workwise', 
      { expiresIn: '7d' }
    );

    // Set refresh token in HTTP-only cookie
  
    res.status(200).json({ accessToken,refreshToken, admin: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};
