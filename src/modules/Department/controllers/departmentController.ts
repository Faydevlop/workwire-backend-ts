import { Request, Response } from "express";
import User from "../../employee/models/userModel";
import mongoose from "mongoose";
import Department from "../model/departmentModel";
import Project from '../../admin/models/projectModel'

export const listNonDepartmentempo = async(req:Request,res:Response):Promise<void>=>{
    console.log('req is here 1');
    
    try {
        const users = await User.find({department:null,position:'Employee'})
        if(!users){
            res.status(400).json({message:'Users not found without department'});
            return
        }
        console.log('req is here 2');
        console.log(users.length);
        

        res.status(200).json(users);

    } catch (error) {
        console.log(error);
        res.status(500).json({message:'error fetching users with not department'})
        
    }
}

export const listManager = async(req:Request,res:Response):Promise<void>=>{
    try {
        const admins = await User.find({department:null,position:'Manager'});
        if(!admins){
            res.status(400).json({message:'admins not found'})
            return
        }

        res.status(200).json(admins)

    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Something broke!'});
    }
}

interface DepartmentData {
    departmentName: string;
    headOfDepartment: mongoose.Schema.Types.ObjectId | string;
    description: string;
    email: string;
    phone: number;
    teamMembers: string[];
  }

export const addDepartment = async (req:Request,res:Response):Promise<void>=>{
    const { departmentName, headOfDepartment, description, email, phone, teamMembers } = req.body as DepartmentData;
   
    

  try {
    // Create a new department
    const newDepartment = new Department({
      departmentName,
      headOfDepartMent:headOfDepartment === 'null' ? null : headOfDepartment ,
      description,
      email,
      phone,
      TeamMembers:teamMembers,
    });

    // Save the department to the database
    const savedDepartment = await newDepartment.save();

    await User.updateOne({_id:headOfDepartment},{$set:{department:savedDepartment._id}})

    await User.updateMany(
        {_id:{$in:teamMembers}},
        {$set:{department:savedDepartment._id}}
    )

    res.status(201).json(savedDepartment);
  } catch (error) {
    console.error('Error adding department:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const showDepartments = async(req:Request,res:Response):Promise<void>=>{
    try {
        const departments = await Department.find().populate('headOfDepartMent')
        if(!departments){
            res.status(400).json({message:'department not found'})
            return
        }

        res.status(200).json(departments)
    } catch (error) {
        console.error('Error listing department:', error);
    res.status(500).json({ message: 'Server error' });
    }
}

export const deleteDepartment = async (req:Request,res:Response):Promise<void>=>{
    try {

        const {departmentId} = req.params;
        const deletedDeparment = await Department.findById(departmentId);
        


        if(!deletedDeparment){
             res.status(404).json({message:'Department not found'})
             return
        }

        await User.updateOne(
            {_id:deletedDeparment.headOfDepartMent},
            {$set:{department:null}}
        )

        await User.updateMany(
            {_id:{$in:deletedDeparment.TeamMembers}},
            {$set:{department:null}}
        )

        await Department.findByIdAndDelete(departmentId);
        

        res.status(200).json({message:'Department deleted successfully'})
        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const listDetails = async(req:Request,res:Response):Promise<void>=>{
    try {
        const {departmentId} = req.params;
        const departmentDetails = await Department.findById(departmentId)
        .populate('headOfDepartMent')
        .populate('TeamMembers')

        if(!departmentDetails){
            res.status(400).json({message:'Department NOt Found'})
            return
        }

        const projectDetails = await Project.find({ department: departmentId });
      
        


       

        res.status(200).json({department:departmentDetails,projects:projectDetails})


    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}



export const editDetails = async(req:Request,res:Response)=>{
    const {departmentId} = req.params;
    const { departmentName, headOfDepartment, description, email, phone, teamMembers } = req.body ;
    try {

        const departmentDetails = await Department.findById(departmentId);

        if(!departmentDetails){
            res.status(400).json({message:'department is not found'})
            return
        }



        departmentDetails.departmentName = departmentName
        departmentDetails.headOfDepartMent = headOfDepartment
        departmentDetails.description = description
        departmentDetails.email = email
        departmentDetails.phone = phone
        departmentDetails.TeamMembers = teamMembers;

        await User.updateMany(
            { _id: { $in: teamMembers } }, 
            { $set: { department: departmentId } }
        );

        await departmentDetails.save()

        res.status(200).json({message:'department Updated success'})
    
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}

export const deleteUser = async(req:Request,res:Response):Promise<void>=>{
    console.log('request are here');
    
    const {departmentId} = req.params;
    const { teamMemberIds } = req.body
    console.log(teamMemberIds,departmentId);
    
    try {
        const departmentDetails = await Department.findById(departmentId);
        if(!departmentDetails){
            res.status(200).json({message:'department is not working'})
            return
        }

        const memberIndex = departmentDetails.TeamMembers.indexOf(teamMemberIds);

        if (memberIndex === -1) {
            res.status(404).json({ message: 'Team member not found in this department' });
            return;
        }

        // Remove the team member from the array
        departmentDetails.TeamMembers.splice(memberIndex, 1);

        // Save the updated department details
        await departmentDetails.save();

        // Optionally, update the user to remove the department association if needed
        await User.findByIdAndUpdate(
            teamMemberIds,
            { $unset: { department: null } },
            { new: true }
        );

        res.status(200).json({ message: 'Team member removed successfully', departmentDetails });
        
        
    } catch (error) {
        
    }
}