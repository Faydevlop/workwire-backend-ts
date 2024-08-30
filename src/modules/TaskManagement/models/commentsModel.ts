import mongoose, { Document, Schema } from "mongoose";

interface IComments extends Document{
    commentedBy:mongoose.Schema.Types.ObjectId;
    comment:string;
    timestamp:Date
    taskId:mongoose.Schema.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
    commentedBy:{ type: Schema.Types.ObjectId, ref: "User", required: true },
    taskId:{ type: Schema.Types.ObjectId, ref: "Tasks", required: true },
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