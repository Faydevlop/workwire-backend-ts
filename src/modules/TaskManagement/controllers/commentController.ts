import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Comments from "../models/commentsModel";
import router from "../routes/taskRoute";
import taskModel from "../models/taskModel";

export const createComment = async(req:Request,res:Response):Promise<void>=>{
    const {taskId} = req.params;
    const {commentedBy,comment} = req.body;

    try {

        if(!commentedBy || !comment){
            res.status(400).json({message:"Please fill all the forms"})
            return
        }
        const newComment = new Comments( {
            commentedBy:commentedBy,
            comment:comment,
            taskId:taskId

        })
        await newComment.save()
        res.status(200).json({message:'Comment Added Succesfull'});
        
    } catch (error) {
        
    }
}

export const listComments = async(req:Request,res:Response):Promise<void>=>{
    const {taskId} = req.params;
    try {
        const comments = await Comments.find({taskId:taskId})
        .populate('commentedBy')

        if(!comments){
            res.status(400).json({message:'No Comments'});
            return
        }

        res.status(200).json({comments})
        
    } catch (error) {
        
    }
}


export const updatestatus = async(req:Request,res:Response):Promise<void>=>{
    try {
        const { id } = req.params;
  const { status } = req.body;

  try {
    // Validate input
    if (!status || !['Pending', 'InProgress', 'Completed'].includes(status)) {
       res.status(400).json({ message: 'Invalid status' });
       return
    }

    // Update the task status
    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
       res.status(404).json({ message: 'Task not found' });
       return
    }

    // Send the updated task back to the client
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Server error' });
  }
    } catch (error) {
        
    }
}