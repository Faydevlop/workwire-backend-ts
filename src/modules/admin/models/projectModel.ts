import mongoose, { Document, Schema } from 'mongoose';

interface IProject extends Document{
    name: string;
  status: string;
  startDate: Date;
  endDate: Date;
  priority: string;
  description: string;
  teamLead: mongoose.Schema.Types.ObjectId;
  teamMates: mongoose.Schema.Types.ObjectId[];
}

const ProjectSchema: Schema = new Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
    description: { type: String },
    teamLead: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teamMates: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  });


  export default mongoose.model<IProject>('Project', ProjectSchema);