import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  seen:boolean;
  messageStatus:string;
}

const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  seen: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  messageStatus:{ type: String, default:'delivered' },
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
