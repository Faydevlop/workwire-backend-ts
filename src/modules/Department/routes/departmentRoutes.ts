import express, { Router } from "express";
import { addDepartment, deleteDepartment, deleteUser, editDetails, listDetails, listManager, listNonDepartmentempo, showDepartments } from "../controllers/departmentController";

const router:Router = express.Router();

// listing users with no department
router.get('/getUsers',listNonDepartmentempo)
// listing manager for Hod
router.get('/listmanager',listManager)
// add department
router.post('/add',addDepartment)
//listing departments
router.get('/list',showDepartments)
// delete department
router.post('/delete/:departmentId',deleteDepartment)
// list department details (sepecific)
router.get('/details/:departmentId',listDetails)
// edit department details
router.put('/edit/:departmentId',editDetails);
// deleting user from department
router.delete('/delete/:departmentId',deleteUser)

export default router