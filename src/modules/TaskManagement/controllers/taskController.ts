import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Task from "../models/taskModel";
import projectModel from "../../admin/models/projectModel";


export const CreateTask = async(req:Request,res:Response):Promise<void>=>{
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