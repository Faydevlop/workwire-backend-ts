import mongoose,{Document,Schema} from "mongoose";

// defining an interface for the admin
interface IAdmin extends Document{
    username:string;
    email:string;
    password:string
}

// defining admin schema
const adminSchema:Schema<IAdmin> = new Schema({
    username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
})

const Admin = mongoose.model<IAdmin>('Admin',adminSchema)
export default Admin