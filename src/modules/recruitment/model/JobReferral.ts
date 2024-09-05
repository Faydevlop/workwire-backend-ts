// src/models/JobReferral.ts

import mongoose, { Document, Schema } from 'mongoose';

interface IJobReferral extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  qualifications: string;
  portfolio: string;
  referer: mongoose.Types.ObjectId;
  resume: string; // URL of the resume uploaded to Cloudinary
  jobId:mongoose.Types.ObjectId;
  status: 'accepted' | 'rejected' | 'pending';
}

const jobReferralSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  qualifications: { type: String, required: true },
  portfolio: { type: String, required: true },
  referer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resume: { type: String, required: true }, // Store the Cloudinary URL
  jobId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: {
    type: String,
    enum: ['accepted', 'rejected', 'pending'],
    default: 'pending',
  }
}, {
  timestamps: true, // Optional: adds createdAt and updatedAt fields
});

const JobReferral = mongoose.model<IJobReferral>('JobReferral', jobReferralSchema);

export default JobReferral;
