import mongoose, { Document, model, Schema } from 'mongoose';

// Define the ILeave interface extending the Mongoose Document interface
interface ILeave extends Document {
    userId: mongoose.Schema.Types.ObjectId;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  status: string;
  reason: string;
  createdAt: Date;
  monthlyLeaveCount:number;
  lastResetDate:Date;
  comment:string;
}

// Create the Leave schema
const LeaveSchema: Schema<ILeave> = new Schema({
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the Employee model
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,   
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'], // Example status values
    default:'Pending'
  },
  monthlyLeaveCount: {
    type: Number,
    default: 0, // Initial leave count is 0
  },
  lastResetDate: {
    type: Date,
    default: Date.now, // Initialize with the current date
  },
  comment: {
    type: String, // Field to store admin's comment
    default: '', // Default is an empty string if no comment is provided
  },
  reason: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current date
  },
});

// Create and export the Leave model
const Leave = model<ILeave>('Leave', LeaveSchema);

export default Leave;
