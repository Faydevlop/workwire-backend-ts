import { Request, Response } from "express"
import Leave from "../models/leaveModel"

export const createLeave = async(req:Request,res:Response)=>{
    console.log('1');
    
    try {
        const {userId,leaveType,startDate,endDate,reason} = req.body;
        console.log(userId,leaveType,startDate,endDate,reason);
        
        if (!userId || !leaveType || !startDate || !endDate || !reason) {
          res.status(400).json({ message: "All fields are required." });
          return 
            
          }

          const newLeave = new Leave({
            userId:userId,
            leaveType,
            startDate:new Date(startDate),
            endDate:new Date(endDate),
            reason,
            createdAt:new Date()
          })
          console.log('3');

          const savedLeave = await newLeave.save()
          return res.status(201).json({
            message: "Leave request created successfully.",
          });
          console.log('4');

    } catch (error) {
        console.log('error',error);
        res.status(500).json({message:'Server error. Please try again later'})
        
    }
}

