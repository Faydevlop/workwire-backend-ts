import express ,{Router} from 'express'
import {employeeLogin} from '../controllers/employeeAuth'
import { updateProfile } from '../controllers/employeeController';
import upload from '../middlewares/profileUpload';
// import { updatePicture } from '../controllers/employeeController';


const router:Router = express.Router();

// employee Login
router.post('/login',employeeLogin)
// update Profile
router.put('/editprofile/:userId',upload.single('profilePhoto'),updateProfile)
// update profile picture


export default router