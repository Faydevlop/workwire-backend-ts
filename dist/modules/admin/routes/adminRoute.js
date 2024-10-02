"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminAuthController_1 = require("../controllers/adminAuthController");
const adminController_1 = require("../controllers/adminController");
const projectController_1 = require("../controllers/projectController");
const router = express_1.default.Router();
// admin login
router.post("/signup", adminAuthController_1.adminSignup);
// admin signup
router.post("/login", adminAuthController_1.adminLogin);
// protected routes
// Adding new User with email verification
router.post("/adduser", adminController_1.AddUser);
// Getting all the user Data
router.get("/getusers", adminController_1.getAllUsers);
// get detials of specific user
router.get("/getuser/:userId", adminController_1.getSpecificUser);
// update user data
router.put("/updateuser/:userId", adminController_1.updateUser);
// delete a specific user
router.delete("/deleteuser/:userId", adminController_1.deleteUser);
// get managers and employees
// router.get("/getmanagers",protect, getAllmanager);
// router.get("/getUnassignedemployees",protect, getAvilableempo);
// post for creating new project
router.post("/addNewProject", projectController_1.addNewProject);
// get for project listing
router.get("/getprojects", projectController_1.listProjects);
// geting specific project details
router.get("/project/:projectId", projectController_1.getprojectdetails);
// edting project
router.post("/editproject/:projectId", projectController_1.editProject);
// delete project
router.post("/deleteproject/:projectId", projectController_1.deleteProject);
// project listing in tasks
router.get('/projectlist/:managerId', projectController_1.projectlisting);
// admin project wise task listing
router.get('/listtask/:projectId', projectController_1.listTasks);
// admin dashboard 
router.get('/dashboard', adminController_1.adminDashboard);
// admin change password
router.post('/changepass/:userId', adminController_1.adminChagePass);
exports.default = router;
