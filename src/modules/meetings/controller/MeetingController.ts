import { Request,Response } from "express";
import { Meeting } from "../model/MeetingModal";
import User from "../../employee/models/userModel";
import moment from "moment";

export const createMeeting = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    try {
      const { meetingName, date, participants, topic, meetingLink, time } = req.body;
  
      if (!meetingName || !date || !participants || !topic || !meetingLink || !time) {
        res.status(400).json({ message: 'Please fill all the required forms' });
        return;
      }
  
      // Convert time to 24-hour format if it's in 12-hour format with AM/PM
      let formattedTime = time;
      if (time.match(/(AM|PM)$/i)) {
        const [timePart, modifier] = time.split(" ");
        let [hours, minutes] = timePart.split(":").map(Number);
  
        if (modifier.toUpperCase() === "PM" && hours < 12) {
          hours += 12;
        } else if (modifier.toUpperCase() === "AM" && hours === 12) {
          hours = 0;
        }
  
        formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      }
  
      const newMeeting = new Meeting({
        meetingName,
        date,
        participants,
        topic,
        link: meetingLink,
        createdBy: userId,
        time: formattedTime
      });
  
      await newMeeting.save();
  
      res.status(200).json({ message: 'Meeting Scheduled Successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Meeting Schedule Error', error });
    }
  };
  

export const findusers = async (req:Request,res:Response):Promise<void>=>{
    const {userId} = req.params;
    try {

        const managerdetails = await User.findById(userId);
        const users = await User.find({department:managerdetails?.department});
        
        if(!managerdetails || !userId){
            res.status(400).json({message:'Error fetching details of user'});
            return
        }

        res.status(200).json({users})
        
    } catch (error) {
        res.status(500).json({message:'Meeting Scheduled error',error});
    }
}

export const listUser = async(req:Request,res:Response):Promise<void>=>{
    try {
        const {userId} = req.params;
        const meetingDetails = await Meeting.find({createdBy:userId});

        if(!meetingDetails){
            res.status(400).json({message:'meeting not found'});
            return
        }

        res.status(200).json({listData:meetingDetails})
        
    } catch (error) {
        res.status(500).json({message:'Error fetching data',error});
    }
}

export const deleteMeeting = async(req:Request,res:Response):Promise<void>=>{
    try {

        const {meetingId} = req.params;
        const deleteMeeting = await Meeting.findByIdAndDelete(meetingId)

        if(!deleteMeeting){
            res.status(400).json({message:'Meeting deleted unsuccessfull'})
            return
        }

        res.status(200).json({message:'meeting deleted successfull'})
        
    } catch (error) {
        res.status(500).json({message:'Error fetching data',error});
    }
}


export const nextmeet = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = moment();

    // Parse the current date and time for better comparison
    const currentDate = now.startOf('day').toDate();
    const currentTime = now.format('HH:mm');

    // Find all meetings that are scheduled for the future, sorted by date and time
    const upcomingMeetings = await Meeting.find({
      $or: [
        {
          date: { $gt: currentDate },  // Meetings after today
          status: 'scheduled',
        },
        {
          date: currentDate,
          time: { $gte: currentTime },  // Meetings today but after the current time
          status: 'scheduled',
        }
      ]
    })
    .sort({ date: 1, time: 1 })  // Sort by date and then by time

    console.log('Upcoming Meetings:', upcomingMeetings);

    if (upcomingMeetings.length === 0) {
      res.status(400).json({ message: 'No upcoming meetings found' });
      return;
    }

    // Return the list of upcoming meetings
    res.status(200).json({upcomingMeetings});

  } catch (error) {
    console.error('Error fetching the upcoming meetings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const meetinglist = async(req:Request,res:Response):Promise<void>=>{
    try {

        const {userId} = req.params;

        const listingData = await Meeting.find({participants:{$in:[userId]}})

        if(!listingData){
            res.status(400).json({message:"message Not found"});
            return
        }

        res.status(200).json({data:listingData})

        
    } catch (error) {
        
    }
}
