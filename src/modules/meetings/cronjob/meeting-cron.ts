import cron from 'node-cron';
import { Meeting } from '../model/MeetingModal'; // Adjust the import path as needed
import mongoose from 'mongoose';

// Function to check and update meeting statuses
const checkMeetingsStatus = async (): Promise<void> => {
  try {
    // Get the current date and time
    const now = new Date();

    // Find meetings that are scheduled but should be ongoing
    const meetingsToUpdate = await Meeting.find({
      status: 'scheduled',
      date: { $lte: now },
      time: { $lte: now.toTimeString().slice(0, 5) }, // Matches "HH:mm" format
    });

    // Update the status of the matched meetings to 'ongoing'
    for (const meeting of meetingsToUpdate) {
      meeting.status = 'ongoing';

      // Check if the meeting is valid before saving
      const validationError = meeting.validateSync();
      if (!validationError) {
        await meeting.save();
        console.log(`Meeting "${meeting.meetingName}" status updated to "ongoing".`);
      } else {
        console.warn(`Meeting "${meeting.meetingName}" has validation errors and was not updated:`, validationError);
      }
    }

    // Find meetings that are ongoing and should be marked as completed
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago

    const meetingsToComplete = await Meeting.find({
      status: 'ongoing',
      date: { $lte: oneHourAgo },
      time: { $lte: oneHourAgo.toTimeString().slice(0, 5) }, // Matches "HH:mm" format
    });

    // Update the status of the matched meetings to 'completed'
    for (const meeting of meetingsToComplete) {
      meeting.status = 'completed';

      // Check if the meeting is valid before saving
      const validationError = meeting.validateSync();
      if (!validationError) {
        await meeting.save();
        console.log(`Meeting "${meeting.meetingName}" status updated to "completed".`);
      } else {
        console.warn(`Meeting "${meeting.meetingName}" has validation errors and was not updated:`, validationError);
      }
    }

  } catch (error) {
    console.error('Error updating meeting statuses:', error);
  }
};

// Cron job that runs every minute
cron.schedule('* * * * *', checkMeetingsStatus);
