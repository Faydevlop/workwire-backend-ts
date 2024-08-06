import mongoose ,{Document,model,Schema} from "mongoose";

// defining interface for user
interface IUser extends Document{
    firstName:string;
      lastName:string;
      email:string;
      dob:Date;
      phone:number;
      gender:string;
      address:string;
      department:string;
      position:string;
      dateOfJoining:Date;
      salary:number;
      employeeStatus:string;
      password:string;
}

const UserSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  phone: { type: Number, required: true },
  gender: { type: String, required: true },
  address: { type: String, required: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  dateOfJoining: { type: Date, required: true },
  salary: { type: Number, required: true },
  employeeStatus: { type: String, required: true },
  password: { type: String, required: true },
})

const User = model<IUser>('User',UserSchema)

export default User