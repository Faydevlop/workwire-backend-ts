import mongoose, { Document, Schema } from "mongoose";

// Define the IDepartMent interface extending Document
interface IDepartMent extends Document {
  departmentName: string;
  description: string;
  headOfDepartMent: mongoose.Schema.Types.ObjectId | null;
  email: string;
  phone:number;
  TeamMembers: mongoose.Schema.Types.ObjectId[];
}

// Define the Department schema
const DepartmentSchema: Schema = new Schema({
  departmentName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  headOfDepartMent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming "User" is the model for managers and employees
    default:null
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: Number,
    required: true,
    trim: true
  },
  TeamMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" // Assuming "User" is the model for team members
    }
  ]
});

// Create and export the Department model
const Department = mongoose.model<IDepartMent>("Department", DepartmentSchema);

export default Department;
