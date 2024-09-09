import { Request, Response } from "express";
import project from "../models/projectModel";
import User from "../../employee/models/userModel";
import mongoose from "mongoose";
import Department from "../../Department/model/departmentModel";
import taskModel from "../../TaskManagement/models/taskModel";

export const addNewProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  

  const {
    name,
    status,
    startDate,
    endDate,
    priority,
    description,
    sdepartment,
 
  } = req.body;


  

  try {


    const newProject = new project({
      name,
      status,
      startDate,
      endDate,
      priority,
      description,
      department: sdepartment || undefined,
   
    });

    await newProject.save();

    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project" });
  }
};

export const listProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await project.find()
   
    
    if (!projects) {
      res.status(400).json({ message: "No Project Found" });
      return;
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ message: "Error fetching projects" });
  }
};

export const getprojectdetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { projectId } = req.params;
    const projectdetails = await project.findById(projectId).populate('department')
     

    if (!projectdetails) {
      res.status(400).json({ message: "project details not found" });
      return;
    }
    res.status(200).json(projectdetails);
  } catch (error) {}
};

export const editProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { projectId } = req.params;
  const {
    name,
    status,
    startDate,
    endDate,
    priority,
    description,
    sdepartment
  } = req.body;

  try {
    const projectdetails = await project.findById(projectId);
    if (!projectdetails) {
      res.status(400).json({ message: "Project not found" });
      return;
    }

    projectdetails.name = name;
    projectdetails.status = status;
    projectdetails.startDate = startDate;
    projectdetails.endDate = endDate;
    projectdetails.priority = priority;
    projectdetails.description = description;
    projectdetails.department = sdepartment;

    // projectdetails.teamLead = teamLead;
    // projectdetails.teamMates = teamMates;

    await projectdetails.save();

    res.status(200).json({ message: "Project updated successfully" });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProject = async (req:Request,res:Response):Promise<void> =>{
            const {projectId} = req.params;
            console.log('delete project request is here',projectId);
            
            try {
              const projectdetails = await project.findById(projectId);
              if(!projectdetails){
                res.status(400).json({message:'Project not found'});
                return
              }

        

              await project.findByIdAndDelete(projectId);

              res.status(200).json({message:'Project deleted successfully'});
              
            } catch (error) {
              console.error('Error deleting project:', error);
              res.status(500).json({ message: 'Server error' });
            }
}

export const projectlisting = async(req:Request,res:Response):Promise<void>=>{
  try {
    const {managerId} = req.params;
    const department = await Department.findOne({headOfDepartMent:managerId});
    if(!department){
      res.status(400).json({message:'Department Not found'});
      return
    }
    const projectDetails = await project.find({department:department._id}).populate('department')

    if(!projectDetails){
      res.status(400).json({message:'project details not found'});
      return
    }

    // Fetch tasks for each project
    const projectIds = projectDetails.map(p => p._id);
    const tasks = await taskModel.find({ projectId: { $in: projectIds } }).populate('projectId')

    res.status(200).json({projectDetails,tasks});
    
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

export const listTasks = async (req:Request,res:Response):Promise<void>=>{
  try {

    const {projectId} = req.params;

    const tasks = await taskModel.find({projectId:projectId})

    if(!tasks){
      res.status(400).json({message:'no tasks found'})
      return
    }
    
    res.status(200).json({tasks})
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}

