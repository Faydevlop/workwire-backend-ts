import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../employee/models/userModel";


interface managerLoginBody{
    email:string;
    password:string;
}

export const managerLogin = async(req:Request<{},{},managerLoginBody>,res:Response):Promise<void>=>{
try {
    const {email ,password} = req.body;
const user = await User.findOne({email:email});


if(!user){
    res.status(400).json({message:'User not found Please'});
    return;
}

const passMatch = await bcrypt.compare(password,user.password);

if(!passMatch){
    res.status(400).json({message:'Wrong Password'});
    return
}

if(user.employeeStatus === 'inactive'){
    res.status(400).json({ message: "Account inactive" });
    return;
  }

if(user.position != 'Manager'){
res.status(400).json({message:'Manager Not Found in this credentials'});
return
}

const token = jwt.sign({userId:user._id},process.env.JWT_SECRET!,{
    expiresIn:'1h'
})

res.status(200).json({token,manager:user})
} catch (error) {
    console.log(error);
    res.status(500).json({error:'An error occured during login'})
    
    
}



}