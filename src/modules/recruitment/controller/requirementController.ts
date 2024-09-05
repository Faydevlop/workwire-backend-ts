import { Request,Response } from "express";
import Job from "../model/recruitementMode";
import JobReferral from "../model/JobReferral";


// Define the job post data interface
interface JobPostData {
    title: string;
    company: string;
    location: string;
    employmentType: string;
    salaryRange: string;
    jobDescription: string;
    requirements: string;
    responsibilities: string;
    applicationProcess: string;
    contactEmail: string;
    contactPhone: string;
    applicationDeadline: string;
    eligibility: string;
  }
  
  export const createRecruitment = async (req: Request, res: Response): Promise<void> => {
    console.log('Received data:', req.body);

    try {
        // Extract job post data from the request body
        const {
            jobTitle,
            role,
            department,
            jobDescription,
            requirements,
            responsibilities,
            location,
            employmentType,
            salaryRange,
            applicationProcess,
            contactEmail,
            contactPhone,
            applicationDeadline,
            eligibility,
        } = req.body;

        // Basic validation
        if (!jobTitle || !role || !department || !jobDescription || !requirements || !responsibilities || !location || !employmentType || !salaryRange || !applicationProcess || !contactEmail || !contactPhone || !applicationDeadline || !eligibility) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }

        // Create a new job post instance
        const newJobPost = new Job({
            jobTitle,
            role,
            department,
            jobDescription,
            requirements,
            responsibilities,
            location,
            employmentType,
            salaryRange,
            applicationProcess,
            contactEmail,
            contactPhone,
            applicationDeadline: new Date(applicationDeadline), // Ensure this is saved as a Date object
            eligibilityCriteria: eligibility,
        });

        // Save the job post to the database
        await newJobPost.save();

        // Respond with success
        res.status(201).json({ message: 'Job post created successfully', jobPost: newJobPost });
    } catch (error) {
        // Handle errors
        console.error('Error creating job post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const listrquirements = async(req:Request,res:Response):Promise<void>=>{
    try {
        
        const listingReq = await Job.find()

        if(!listingReq){
            res.status(400).json({message:'No Job Listing found'})
            return
        }

        res.status(200).json({listingData:listingReq})

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteItem = async(req:Request,res:Response):Promise<void>=>{
    try {

        const {listId} = req.params
        
        const deletedData = await Job.findByIdAndDelete(listId)

        if(!deletedData){
            res.status(400).json({message:'unaible to delete'})
            return
        }

        res.status(200).json({message:'deleted succesefull'})
        
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const referJob = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, phone, address, qualifications, portfolio, referer,jobId } = req.body;
      const resumeUrl = (req.file as any)?.path; // Cloudinary file URL
  
      console.log('Resume URL:', resumeUrl);
  
      // Create a new job referral entry in the database
      const jobReferral = new JobReferral({
        name,
        email,
        phone,
        address,
        qualifications,
        portfolio,
        referer,
        resume: resumeUrl,
        jobId
      });
  
      await jobReferral.save();
  
      res.status(200).json({
        message: 'Job referred successfully'
      });
    } catch (error) {
      res.status(500).json({ message: 'Error referring job', error });
    }
  };

  export const listIReq = async(req:Request,res:Response):Promise<void>=>{
    try {

        const listData = await JobReferral.find().populate('referer').populate('jobId')

        if(!listData){
            res.status(400).json({message:"No Job Listing found"})
            return
        }
        // console.log('here is the data',listData);
        

        res.status(200).json({listData})
        
    } catch (error) {
        res.status(500).json({ message: 'Error listing job', error });
    }
  }

  export const listspecific = async(req:Request,res:Response):Promise<void>=>{
    try {
        const {reqId} = req.params;

        const listDetail = await JobReferral.findById(reqId).populate('jobId').populate('referer')
        if(!listDetail){
            res.status(400).json({message:'No data found'})
            return
        }

        res.status(200).json({listDetail})


    } catch (error) {
        res.status(500).json({ message: 'Error listing job', error });
    }
  }