import { Request, Response } from "express";
import notificationModel from "../model/notificationModel";

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
    console.log('notificaion req is here');
    
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
  