import { Request, Response } from "express";
import Payroll from "../models/payrollModel";
import User from "../../employee/models/userModel";
import mongoose from "mongoose";

const calculateTotalPay = (
    baseSalary: number,  // Assume this is the annual salary
    bonus: number,
    deductions: number,
    payPeriod: string,
    payPeriodStart: Date,
    payPeriodEnd: Date
) => {
    const startDate = new Date(payPeriodStart);
    const endDate = new Date(payPeriodEnd);

    const monthsCount = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;

    const monthlyBaseSalary = baseSalary / 12;

    const perMonthSalary = Math.round(monthlyBaseSalary + bonus - deductions);

    const totalAmount = Math.round(perMonthSalary * monthsCount);

    return { totalAmount, perMonthSalary };
};




export const AddPayroll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { employeeId, payPeriodStart, payPeriodEnd, payPeriod, baseSalary, bonus, deductions, paymentStatus, paymentMethod } = req.body;

        if (!employeeId || !payPeriodStart || !payPeriodEnd || !payPeriod || !baseSalary || !paymentStatus || !paymentMethod) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        // Calculate the total amount and per month salary based on the inputs
        const { totalAmount, perMonthSalary } = calculateTotalPay(baseSalary, bonus || 0, deductions || 0, payPeriod, new Date(payPeriodStart), new Date(payPeriodEnd));

        const newPayroll = new Payroll({
            employee: employeeId,
            payPeriodStart,
            payPeriodEnd,
            payPeriod,
            baseSalary,
            bonuses:  0,
            deductions:  0,
            totalAmount: totalAmount,
            permonthsalary: Number(perMonthSalary),
            paymentStatus,
            paymentMethod,
        });

        const user = await User.findById(employeeId);

        if (!user) {
            res.status(400).json({ message: "User Not Found" });
            return;
        }

        user.payroll = newPayroll._id as mongoose.Schema.Types.ObjectId;
        await user.save();

        await newPayroll.save();

        res.status(201).json({ message: "Payroll record Updated successfully", data: newPayroll });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};


export const UpdatePayroll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // Assuming the payroll ID is passed as a route parameter
        const { employeeId, payPeriodStart, payPeriodEnd, payPeriod, baseSalary, bonus, deductions, paymentStatus, paymentMethod } = req.body;

        if (!id || !employeeId || !payPeriodStart || !payPeriodEnd || !payPeriod || !baseSalary || !paymentStatus || !paymentMethod) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        // Find the payroll record by ID
        const payroll = await Payroll.findById(id);

        if (!payroll) {
            res.status(404).json({ message: "Payroll record not found" });
            return;
        }

        // Calculate the total amount and per month salary based on the updated inputs
        const { totalAmount, perMonthSalary } = calculateTotalPay(baseSalary, bonus || 0, deductions || 0, payPeriod, new Date(payPeriodStart), new Date(payPeriodEnd));

        // Update the payroll record
        payroll.employee = employeeId;
        payroll.payPeriodStart = new Date(payPeriodStart);
        payroll.payPeriodEnd = new Date(payPeriodEnd);
        payroll.payPeriod = payPeriod;
        payroll.baseSalary = baseSalary;
        payroll.bonuses = bonus || 0;
        payroll.deductions = deductions || 0;
        payroll.totalAmount = totalAmount;
        payroll.permonthsalary = Number(perMonthSalary);
        payroll.paymentStatus = paymentStatus;
        payroll.paymentMethod = paymentMethod;

        await payroll.save();

        res.status(200).json({ message: "Payroll record updated successfully", data: payroll });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};



export const UpdatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { payrollId, paymentStatus } = req.body;

        if (!payrollId || !paymentStatus) {
            res.status(400).json({ message: "Payroll ID and payment status are required" });
            return;
        }

        const payroll = await Payroll.findById(payrollId);

        if (!payroll) {
            res.status(404).json({ message: "Payroll record not found" });
            return;
        }

        payroll.paymentStatus = paymentStatus;

        // If the payment is made, reset bonuses and deductions
        if (paymentStatus === 'Paid') {
            payroll.bonuses = 0;
            payroll.deductions = 0;
            await payroll.save();
        }

        res.status(200).json({ message: "Payment status updated successfully", data: payroll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
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

    res.status(200).json({employee:payrolldetails})
        
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

export const hrlisting = async(req:Request,res:Response):Promise<void>=>{
    try {
        const allpayrolldata = await Payroll.find().populate('employee')

        if(!allpayrolldata){
            res.status(400).json({message:"no payroll exist"})
            return
        }

        res.status(200).json({payroll:allpayrolldata})
        
    } catch (error) {
        
    }
}

export const listdataspecific = async(req:Request,res:Response):Promise<void>=>{
    try {
        console.log('req is here');
        

        const {userId} = req.params;

        const payrolldata = await Payroll.findOne({employee:userId})

        if(!payrolldata){
            res.status(400).json({message:'no Payroll data found'})
            return
        }
        
        res.status(200).json({payroll:payrolldata})
        
    } catch (error) {
        
    }
}

export const listViewdata = async(req:Request,res:Response):Promise<void>=>{
    try {

        const totalUser = await User.find()
        const totalUsernotpayroll = await User.find({payroll:null})

        const listView = {
            totalUser:totalUser.length,
            nopayrollUser:totalUsernotpayroll.length
        }

        res.status(200).json({listView})

        
    } catch (error) {
        
    }
}