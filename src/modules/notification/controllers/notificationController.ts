import { Request, Response } from "express";
import notificationModel from "../model/notificationModel";
import mongoose from "mongoose";
import User from "../../employee/models/userModel";
import Message from "../../chat/chatModel";

export const createNotification = async(req:Request,res:Response):Promise<void>=>{
    const { senderId, receiverId, roomId } = req.body;
  
    try {
      // Create a new notification in the database
      const newNotification = new notificationModel({
        sender: senderId,
        receiver: receiverId,
        type: 'video-call',
        roomId: roomId,
        timestamp: new Date()
      });
  
      await newNotification.save();
  
       res.status(200).json({ message: 'Video call notification sent!' });
    } catch (error) {
       res.status(500).json({ error: 'Failed to send video call notification' });
    }
  }

  export const checkNotification = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    // console.log('notificaion req is here');
    
    try {
      // Find the notification for the user that hasn't been marked as sent
      const notifications = await notificationModel.find({
        receiver: userId,
        isNotificationSend: false
      });

      res.status(200).json(notifications);
  
      // If there are notifications, mark them as sent
      if (notifications.length > 0) {
        await notificationModel.updateMany(
          { receiver: userId, isNotificationSend: false },
          { $set: { isNotificationSend: true } }
        );
      }
  
     
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  };
  export const getUsersSortedByLastMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { currentUserId } = req.params;
  
      // Fetch users who have exchanged messages with the current user
      const latestMessages = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: new mongoose.Types.ObjectId(currentUserId) },
              { receiver: new mongoose.Types.ObjectId(currentUserId) }
            ]
          }
        },
        {
          $sort: { timestamp: -1 }  // Sort by latest messages first
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$sender", new mongoose.Types.ObjectId(currentUserId)] },
                "$receiver",
                "$sender"
              ]
            },
            lastMessage: { $first: "$$ROOT" }  // Capture the first (most recent) message for each user
          }
        }
      ]);
  
      // Extract user IDs from the aggregation result
      const userIdsWithMessages = latestMessages.map((message: { _id: mongoose.Types.ObjectId }) => message._id);
  
      // Fetch user details for those who have exchanged messages
      let usersWithMessages = await User.find({ _id: { $in: userIdsWithMessages } });
  
      // Also fetch all other users who haven't exchanged messages yet
      let usersWithoutMessages = await User.find({
        _id: { $nin: [new mongoose.Types.ObjectId(currentUserId), ...userIdsWithMessages] }
      });
  
      // Combine both sets of users, placing those with recent messages on top
      let allUsers = [
        ...usersWithMessages, // Users with messages (sorted by most recent)
        ...usersWithoutMessages // Users without any message interaction
      ];
  
      console.log('Full Users List:', allUsers);
  
      // Return the users list in the response
      res.status(200).json({ users: allUsers });
  
    } catch (error) {
      console.error("Error fetching users sorted by last message:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  };
  