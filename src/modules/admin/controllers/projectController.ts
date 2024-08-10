import { Request, Response } from 'express';
import project from '../models/projectModel';
import User from '../../employee/models/userModel'
import mongoose from 'mongoose';

export const addNewProject = async (req:Request,res:Response):Promise<void>=>{
    console.log('project add request is here');
    
    const { name, status, startDate, endDate, priority, description, teamLead, teamMates } = req.body;
    

    try {
          // Check if teamLead is provided and is a valid ObjectId
          if (teamLead && mongoose.Types.ObjectId.isValid(teamLead)) {
            const leadExist = await User.findById(teamLead);
            if (!leadExist) {
                console.log('project add request is here1');
                res.status(400).json({ message: 'Team Lead Not Found' });
                return;
            }
        } else if (teamLead) {
            res.status(400).json({ message: 'Invalid Team Lead ID' });
            return;
        }

        const matesExist = await User.find({_id:{$in:teamMates}})
        if(matesExist.length !== teamMates.length ){
            console.log('project add request is here2');
            res.status(400).json({message:'One or more team mates not found'})
            return
        }

        if(teamLead){
            await User.findByIdAndUpdate(teamLead,{projectAssigned:true})
        }

        await User.updateMany(
            { _id: { $in: teamMates } },
            { $set: { projectAssigned: true } }
        );

        const newProject = new project({
            name,
            status,
            startDate,
            endDate,
            priority,
            description,
            teamLead: teamLead || undefined,
            teamMates,
        })

        await newProject.save();

        res.status(201).json({message:'Project created successfully'})
        
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project' });
        
    }
}

export const listProjects = async (req:Request,res:Response):Promise<void> =>{
    try {
        const projects = await project.find();
        if(!projects){
            res.status(400).json({message:'No Project Found'});
            return
        }
        console.log(projects);
        
        res.status(200).json(projects)
        
    } catch (error) {
        res.status(400).json({message:'Error fetching projects'})
    }
    
}

export const getprojectdetails = async (req:Request,res:Response):Promise<void> =>{
    try {
        const {projectId} = req.params
        const projectdetails = await project.findById(projectId)
        .populate('teamLead') 
        .populate('teamMates')
        
        if(!projectdetails){
            res.status(400).json({message:'project details not found'})
            return
        }
        res.status(200).json(projectdetails);

    } catch (error) {
        
    }
}