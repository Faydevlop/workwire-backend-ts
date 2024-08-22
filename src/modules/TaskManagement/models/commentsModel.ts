import mongoose, { Document, Schema } from "mongoose";

interface IComments extends Document{
    commentedBy:mongoose.Schema.Types.ObjectId;
    comments:string;
    timestamp:Date
}

const TaskSchema: Schema = new Schema({
    commentedBy:{ type: Schema.Types.ObjectId, ref: "User", required: true },
    comment:{
        type: String,
        required: true
      },
    createdAt: {
        type: Date,
        default: Date.now
      }
})

export default mongoose.model<IComments>('Comments',TaskSchema  )