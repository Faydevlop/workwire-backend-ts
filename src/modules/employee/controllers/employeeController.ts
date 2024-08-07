
import {Request,Response} from 'express'
import User from '../models/userModel'
import path from 'path';

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    console.log('Profile update request is here');
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Update user fields
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.dob = req.body.dob || user.dob;
        user.phone = req.body.phone || user.phone;
        user.gender = req.body.gender || user.gender;
        user.address = req.body.address || user.address;

        // Update profile image if it exists
        if (req.file) {
            const relativePath = path.join('uploads', req.file.filename); // Create relative path
            user.profileImageUrl = relativePath; // Save relative path to the database
        }

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};  

