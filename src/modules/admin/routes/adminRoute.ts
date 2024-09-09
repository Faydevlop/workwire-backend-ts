import express, { Router } from "express";
import { adminLogin, adminSignup } from "../controllers/adminAuthController";
import { protect } from "../../../middlewares/jwtMiddleware";







import {
  AddUser,
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
router.post("/adduser",protect, AddUser);
// Getting all the user Data
router.get("/getusers",protect, getAllUsers);
// get detials of specific user
router.get("/getuser/:userId",protect, getSpecificUser);
// update user data
router.put("/updateuser/:userId",protect, updateUser);
// delete a specific user
router.delete("/deleteuser/:userId",protect, deleteUser);
// get managers and employees
// router.get("/getmanagers",protect, getAllmanager);
// router.get("/getUnassignedemployees",protect, getAvilableempo);
// post for creating new project
router.post("/addNewProject",protect, addNewProject);
// get for project listing
router.get("/getprojects",protect, listProjects);
// geting specific project details
router.get("/project/:projectId",protect, getprojectdetails);
// edting project
router.post("/editproject/:projectId",protect, editProject);
// delete project
router.post("/deleteproject/:projectId",deleteProject)
// project listing in tasks
router.get('/projectlist/:managerId',projectlisting)
// admin project wise task listing
router.get('/listtask/:projectId',listTasks)

export default router;
