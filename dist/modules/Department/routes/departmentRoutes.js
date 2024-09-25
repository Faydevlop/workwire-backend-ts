"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const departmentController_1 = require("../controllers/departmentController");
const router = express_1.default.Router();
// listing users with no department
router.get('/getUsers', departmentController_1.listNonDepartmentempo);
// listing manager for Hod
router.get('/listmanager', departmentController_1.listManager);
// add department
router.post('/add', departmentController_1.addDepartment);
//listing departments
router.get('/list', departmentController_1.showDepartments);
// delete department
router.post('/delete/:departmentId', departmentController_1.deleteDepartment);
// list department details (sepecific)
router.get('/details/:departmentId', departmentController_1.listDetails);
// edit department details
router.put('/edit/:departmentId', departmentController_1.editDetails);
// deleting user from department
router.delete('/delete/:departmentId', departmentController_1.deleteUser);
exports.default = router;
