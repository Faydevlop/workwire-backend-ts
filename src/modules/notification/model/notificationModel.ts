import mongoose, { Schema, Document } from 'mongoose';

interface INotification extends Document {
  sender: string;
  receiver: string;
  type: string;
  roomId: string;
  timestamp: Date;
  isNotificationSend:Boolean
}

const NotificationSchema: Schema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['message', 'video-call'], required: true },
  roomId: { type: String, required: false },
  isNotificationSend: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
