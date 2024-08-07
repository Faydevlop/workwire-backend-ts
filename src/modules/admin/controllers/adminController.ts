import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import {Request,Response} from 'express'
import User from '../../employee/models/userModel'

import sendVerificationmail from '../middlewares/mailVerification'

interface AddUserBody{
    firstName:string;
      lastName:string;
      email:string;
      dob:Date;
      phone:number;
      gender:string;
      address:string;
      department:string;
      position:string;
      dateOfJoining:Date;
      salary:number;
      employeeStatus:string;
      password:string;
      profile:string
}

function generateRandomPassword(length = 12) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
  
    return password;
  }

export const AddUser = async(req:Request<{},{},AddUserBody>,res:Response):Promise<void>=>{
    try {
        console.log('add user request is here');
        

        const {firstName,
            lastName,
            email,
            dob,
            phone,
            gender,
            address,
            department,
            position,
            dateOfJoining,
            salary,
            employeeStatus} = req.body


            const existUser = await User.findOne({email});
            if(existUser){
                res.status(400).json({message:'User already Exists In this Email'});
                return
            }

            const randomPass = generateRandomPassword()
            const hashedPassword = await bcrypt.hash(randomPass,10);

            const newUser = new User({
                firstName,
                lastName,
                email,
                dob,
                phone,
                gender,
                address,
                department,
                position,
                dateOfJoining,
                salary,
                employeeStatus,
                password: hashedPassword 
            })

            await newUser.save()

            await sendVerificationmail(email,randomPass,req.body.position);
            

           
            res.status(201).json({message:'User created successfully , Email verification sent'})

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Server error' });
        
    }
}


export const getAllUsers = async(req:Request,res:Response)=>{
    try {
        const allUsers = await User.find()
        if(!allUsers){
            res.status(400).json({message:'Users collection is empty'})
            return
        }

        res.status(201).json({allUsers})
    } catch (error) {
        res.status(400).json({message:'Somthing went Wrong'})
        
    }

}

export const getSpecificUser = async (req:Request,res:Response)=>{
    console.log('specific user request is here');
    
    const {userId} = req.params;
    try {
        const user = await User.findById(userId);
        if(!user){
            res.status(400).json({message:'User Nor found'})
            return
        }
        res.json(user)


    } catch (error) {
        res.status(500).json({message:'Server error',error})
        
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.dob = req.body.dob || user.dob;
        user.phone = req.body.phone || user.phone;
        user.gender = req.body.gender || user.gender;
        user.address = req.body.address || user.address;
        user.department = req.body.department || user.department;
        user.position = req.body.position || user.position;
        user.dateOfJoining = req.body.dateOfJoining || user.dateOfJoining;
        user.salary = req.body.salary || user.salary;
        user.employeeStatus = req.body.employeeStatus || user.employeeStatus;

        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error});
    }
};

export const deleteUser = async (req:Request,res:Response) : Promise<void>=>{
    
    try {
        const {userId} = req.params;
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            res.status(404).json({message:'User not found'})
            return
        }

        res.status(200).json({message:'User delete sucessfull'})

        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error});
    }
}