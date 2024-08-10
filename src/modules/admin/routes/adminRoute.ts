import express ,{Router} from 'express';
import {adminLogin,adminSignup}  from '../controllers/adminAuthController'
import verifyToken from '../../../middlewares/jwtMiddleware';
import { AddUser, deleteUser, getAllUsers, getSpecificUser, updateUser } from '../controllers/adminController';
import { getAllmanager, getAvilableempo } from '../controllers/operationController';
import { addNewProject, getprojectdetails, listProjects } from '../controllers/projectController';

const router:Router = express.Router();

// admin login
router.post('/signup',adminSignup)
// admin signup 
router.post('/login',adminLogin)
// Adding new User with email verification
router.post('/adduser',AddUser) 
// Getting all the user Data
router.get('/getusers',getAllUsers)
// get detials of specific user
router.get('/getuser/:userId',getSpecificUser)
// update user data
router.put('/updateuser/:userId',updateUser)        
// delete a specific user
router.delete('/deleteuser/:userId',deleteUser)
// get managers and employees
router.get('/getmanagers',getAllmanager)
router.get('/getUnassignedemployees',getAvilableempo)
// post for creating new project
router.post('/addNewProject',addNewProject)
// get for project listing
router.get('/getprojects',listProjects)
// geting specific project details 
router.get('/project/:projectId',getprojectdetails)

export default router;