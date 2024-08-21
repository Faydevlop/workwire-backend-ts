import mongoose, { Document, Schema } from "mongoose";

interface IProject extends Document {
  name: string;
  status: string;
  startDate: Date;
  endDate: Date;
  priority: string;
  description: string;
  department: mongoose.Schema.Types.ObjectId;

}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], required: true },
  description: { type: String },
  department: { type: Schema.Types.ObjectId, ref: "Department", required: true }

 
});

export default mongoose.model<IProject>("Project", ProjectSchema);
