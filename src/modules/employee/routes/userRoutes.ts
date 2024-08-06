import express ,{Router} from 'express'
import {employeeLogin} from '../controllers/employeeAuth'
import { updateProfile } from '../controllers/employeeController';


const router:Router = express.Router();

// employee Login
router.post('/login',employeeLogin)
// update Profile
router.put('/editprofile/:userId',updateProfile)

export default router