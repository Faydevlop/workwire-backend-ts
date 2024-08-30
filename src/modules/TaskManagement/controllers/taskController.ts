import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Task from "../models/taskModel";
import projectModel from "../../admin/models/projectModel";
import User from "../../employee/models/userModel";


export const CreateTask = async(req:Request,res:Response):Promise<void>=>{
    console.log('task create reqeust is here');
    
    const {ProjectId} = req.params;
        const {taskTitle,
            status,
            assignedTo,
            priority,
            startDate,
            dueDate,
            description
        } = req.body;
      

    try {

        const isProjectExist = await projectModel.findById(ProjectId);

        if(!isProjectExist){
            res.status(200).json({message:'Project not found'})
            return
        }

        const newTask = new Task({
            projectId:ProjectId,
            name:taskTitle,
            description:description,
            status:status,
            dueDate:dueDate,
            assignedTo:assignedTo,
            createdAt:startDate,
            priority:priority,
        })

        await newTask.save();

        res.status(200).json({message:'task created successfully'})
    } catch (error) {
        res.status(500).json({ message: "Error creating project" });
    }
}

export const listUsers = async(req:Request,res:Response):Promise<void>=>{
    console.log('user list request is here');
    
    try {

        const { ProjectId } = req.params;
        const projectDetails = await projectModel.findById(ProjectId);


        if (!projectDetails) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        const userDetails = await User.find({department:projectDetails.department,position:'Employee'});
       
        

        if (!userDetails) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }

        res.status(200).json({ users: userDetails });
        
        
    } catch (error) {
        res.status(500).json({ message: error});
    }
}

export const taskdetails = async(req:Request,res:Response):Promise<void>=>{
    try {
        const {taskId} = req.params;
        const taskDetails = await Task.findById(taskId).populate('assignedTo')

        if(!taskDetails){
            res.status(400).json({message:'Task is not found'})
            return
        }

        res.status(200).json({task:taskDetails});

    } catch (error) {
        res.status(500).json({ message: error});
    }
}

export const listTasks = async(req:Request,res:Response):Promise<void>=>{
    try {
        const {employeeId} = req.params;

        // Find tasks where the employee is assigned
        const tasks = await Task.find({ assignedTo: employeeId })
            .populate('projectId')   // Populate project details if needed
            .populate('assignedTo')   // Populate user details if needed
            .populate('comments');    // Populate comments details if needed

        // Send the tasks as a response
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
    }
}