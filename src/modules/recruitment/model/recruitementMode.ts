import mongoose, { Schema, Document } from 'mongoose';

interface IJob extends Document {
  jobTitle: string;
  role: string;
  department: string;
  jobDescription: string;
  requirements: string;
  responsibilities: string;
  location: string;
  employmentType: string;
  salaryRange: string;
  applicationProcess: string;
  contactEmail: string;
  contactPhone: string;
  applicationDeadline: Date;
  eligibilityCriteria: string;
  additionalNotes?: string;

}

const JobSchema: Schema = new Schema({
  jobTitle: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  jobDescription: { type: String, required: true },
  requirements: { type: String, required: true },
  responsibilities: { type: String, required: true },
  location: { type: String, required: true },
  employmentType: { type: String, required: true },
  salaryRange: { type: String, required: true },
  applicationProcess: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  applicationDeadline: { type: Date, required: true },
  eligibilityCriteria: { type: String, required: true },
  additionalNotes: { type: String, default: '' },
}, {
  timestamps: true
});

const Job = mongoose.model<IJob>('Job', JobSchema);

export default Job;
