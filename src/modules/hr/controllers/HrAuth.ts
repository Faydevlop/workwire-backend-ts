import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../employee/models/userModel";
import { generateAccessToken } from "../../../middlewares/jwt";

interface  HrLoginBody{
    email:string;
    password:string;
}

export const HrLogin = async(req:Request<{},{},HrLoginBody>,res:Response):Promise<void>=>{
    try {
        const {email ,password} = req.body;
    const user = await User.findOne({email:email});
    
    
    if(!user){
        res.status(400).json({message:'User not found Please'});
        return;
    }
    
    const passMatch = await bcrypt.compare(password,user.password);
    
    if(!passMatch){
        res.status(400).json({message:'Wrong Password'});
        return
    }
    
    if(user.employeeStatus === 'inactive'){
        res.status(400).json({ message: "Account inactive" });
        return;
      }
    
    if(user.position != 'HR'){
    res.status(400).json({message:'Hr Not Found in this credentials'});
    return
    }
    
    const accessToken = generateAccessToken(user._id);  // Corrected here
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET!, 
      { expiresIn: '7d' }
    );

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure the cookie is sent over HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    
    res.status(200).json({accessToken,hr:user})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'An error occured during login'})
        
        
    }
}