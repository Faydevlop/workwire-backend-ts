import express, { Router } from "express";
import { adminLogin, adminSignup } from "../controllers/adminAuthController";
import { protect } from "../../../middlewares/jwtMiddleware";







import {
  AddUser,
  adminChagePass,
  adminDashboard,
  deleteUser,
  getAllUsers,
  getSpecificUser,
  updateUser,
} from "../controllers/adminController";

import {
  addNewProject,
  deleteProject,
  editProject,
  getprojectdetails,
  listProjects,
  listTasks,
  projectlisting,
} from "../controllers/projectController";

const router: Router = express.Router();

// admin login
router.post("/signup", adminSignup);
// admin signup
router.post("/login", adminLogin);

// protected routes

// Adding new User with email verification
router.post("/adduser", AddUser);
// Getting all the user Data
router.get("/getusers", getAllUsers);
// get detials of specific user
router.get("/getuser/:userId", getSpecificUser);
// update user data
router.put("/updateuser/:userId", updateUser);
// delete a specific user
router.delete("/deleteuser/:userId", deleteUser);
// get managers and employees
// router.get("/getmanagers",protect, getAllmanager);
// router.get("/getUnassignedemployees",protect, getAvilableempo);
// post for creating new project
router.post("/addNewProject", addNewProject);
// get for project listing
router.get("/getprojects", listProjects);
// geting specific project details
router.get("/project/:projectId", getprojectdetails);
// edting project
router.post("/editproject/:projectId", editProject);
// delete project
router.post("/deleteproject/:projectId",deleteProject)
// project listing in tasks
router.get('/projectlist/:managerId',projectlisting)
// admin project wise task listing
router.get('/listtask/:projectId',listTasks)
// admin dashboard 
router.get('/dashboard',adminDashboard)
// admin change password
router.post('/changepass/:userId',adminChagePass)

export default router;
