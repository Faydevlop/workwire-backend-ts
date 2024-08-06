
import {Request,Response} from 'express'
import User from '../models/userModel'

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    console.log('profile update request is here');
    
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.dob = req.body.dob || user.dob;
        user.phone = req.body.phone || user.phone;
        user.gender = req.body.gender || user.gender;
        user.address = req.body.address || user.address;
        user.department = req.body.department || user.department;
        user.position = req.body.position || user.position;
        user.dateOfJoining = req.body.dateOfJoining || user.dateOfJoining;
        user.salary = req.body.salary || user.salary;
        user.employeeStatus = req.body.employeeStatus || user.employeeStatus;

        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error});
    }
};