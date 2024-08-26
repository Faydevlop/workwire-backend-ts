import { Request, Response } from "express";
import Payroll from "../models/payrollModel";
import User from "../../employee/models/userModel";
import mongoose from "mongoose";

export const AddPayroll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { employeeId, payPeriodStart, payPeriodEnd, payDate, baseSalary, bonus, deductions, paymentStatus, paymentMethod } = req.body;
        if (!employeeId || !payPeriodStart || !payPeriodEnd || !payDate || !baseSalary || !paymentStatus || !paymentMethod) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
      
        const newPayroll = new Payroll({
            employee:employeeId,
            payPeriodStart,
            payPeriodEnd,
            payDate,
            baseSalary : baseSalary || 0,
            bonuses: bonus || 0 ,
            totalAmount:(baseSalary || 0) + (bonus || 0) - (deductions || 0),
            deductions:deductions || 0,
            paymentStatus,
            paymentMethod
        });

        const user = await User.findById(employeeId);

        if(!user){
            res.status(400).json({message:'User Not Found'});
            return
        }

        user.payroll = newPayroll._id as  mongoose.Schema.Types.ObjectId;  

        await user.save()

        
        await newPayroll.save();

        
        res.status(201).json({ message: "Payroll record created successfully", data: newPayroll });

    } catch (error) {
        console.error(error);
        // Respond with error message
        res.status(500).json({ message: "Server error",error });
    }
};

export const listEmployee = async(req:Request,res:Response):Promise<void>=>{
    try {

        
        const users = await User.find({payroll:null});

        if(!users){
            res.status(400).json({message:'user not found'});
            return
        }

        res.status(200).json({users});
        
    } catch (error) {
        res.status(500).json({ message: "Server error",error });
    }
}

export const listallUsers = async(req:Request,res:Response):Promise<void>=>{
    try {
        const users = await User.find({payroll:{$ne:null}}).populate('payroll')
        if(!users){
            res.status(400).json({message:'Users not found'})
            return
        }

        res.status(200).json({users});

    } catch (error) {
        res.status(500).json({ message: "Server error",error });
    }
}

export const listspecificId = async(req:Request,res:Response)=>{
    const {payrollId} = req.params;
    
    try {

    const payrolldetails = await Payroll.findById(payrollId)
    .populate('employee')

    if(!payrollId){
        res.status(400).json({message:'Payroll details not found'});
        return
    }

    res.status(200).json({payroll:payrolldetails})
        
    } catch (error) {
         res.status(500).json({ message: "Server error",error });
    }
}

export const listDepartmetentwise = async (req:Request,res:Response):Promise<void>=>{
    try {
       
        
      const {managerId} = req.params;
      console.log(managerId);
      

      const managerinfo = await User.findById(managerId).populate('department')
      if (!managerinfo || !managerinfo.department) {
        // Handle the case where managerinfo or department is null
        throw new Error("Manager information or department not found");
      }
      
      const users = await User.find({
        department: managerinfo.department, 
        position: 'Employee'
      }).populate('payroll');

      if(!users){
        res.status(400).json({message:'Users not found'});
        return
      }

      res.status(200).json({users})


    } catch (error) {
        res.status(500).json({ message: "Server error",error });
    }
}


export const showUser = async(req:Request,res:Response)=>{
    const {userId} = req.params;

    try {

        const user = await User.findById(userId).populate('payroll');
        console.log(user);
        

        if(!user){
            res.status(400).json({message:'User not found'})
            return
        }

        res.status(200).json({user})
        
    } catch (error) {   
        res.status(500).json({ message: "Server error",error });
    }

}

export const addPay = async(req:Request,res:Response)=>{
    console.log('update request is here');
    
    try {

        const {payrollId} = req.params
        const {deduction ,bonuses  } =req.body
        const payroll = await Payroll.findById(payrollId);

        
        if(!payroll){
            res.status(400).json({message:'payroll details not found'})
            return
        }
        
        

         // Updating the deduction and bonuses logic
         payroll.deductions = (payroll.deductions || 0) + Number(deduction); 
         payroll.bonuses = (payroll.bonuses || 0) + Number(bonuses); 
         payroll.totalAmount = payroll.totalAmount - Number(deduction) + Number(bonuses);

         await payroll.save();

        res.status(200).json({message:'Payroll details Updated succesfull'})
        
    } catch (error) {
        res.status(500).json({ message: "Server error",error });
    }
}