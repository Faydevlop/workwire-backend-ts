import {Request,Response} from 'express'
import User from '../models/userModel';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

interface UserLogin{
    email:string;
    password:string;
}

export const employeeLogin = async(req:Request<{},{},UserLogin>,res:Response):Promise<void>=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email})

        if(!user){
            res.status(400).json({message:'User Not Found'});
            return
        }

        const passMatch = await bcrypt.compare(password,user.password);

        if(!passMatch){
            res.status(400).json({message:'Wrong password'})
            return
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET!,{
            expiresIn:'1d'
        })

        res.status(200).json({token,user:user})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred during login' });
            
        
    }
}