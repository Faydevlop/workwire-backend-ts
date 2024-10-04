import mongoose, { Document, Schema } from "mongoose";

interface ITasks extends Document{
    projectId:mongoose.Schema.Types.ObjectId;
    name:string;
    description:string;
    status:string;
    dueDate:Date;
    assignedTo:mongoose.Schema.Types.ObjectId[] | null ;
    createdAt:Date;
    comments:mongoose.Schema.Types.ObjectId[] | null;
    priority:string;
    cat:String;
    attachments:String
}

const TaskSchema: Schema = new Schema({
    projectId:{ type: Schema.Types.ObjectId, ref: "Project", required: true },
    name:String,
    description:String,
    status:String,
    dueDate:Date,
    assignedTo:[{ type: Schema.Types.ObjectId, ref: "User", default:null }],
    createdAt:Date,
    comments:[{ type: Schema.Types.ObjectId, ref: "Comments", default:null }],
    priority:String,
    cat:{type:String ,default:'Task'},
    attachments: [
        {
          fileName: { type: String,  },
          fileUrl: { type: String, },
          uploadedAt: { type: Date, default: Date.now },
        },
        
      ],
})

export default mongoose.model<ITasks>('Tasks',TaskSchema  ) 