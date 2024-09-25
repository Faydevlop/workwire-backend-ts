"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const router = express_1.default.Router();
// create task route
router.post('/createtask/:ProjectId', taskController_1.CreateTask);
// listing users for task creating
router.get('/listUsers/:ProjectId', taskController_1.listUsers);
// list task details 
router.get(`/taskdetails/:taskId`, taskController_1.taskdetails);
// listing tasks based on employee
router.get('/listtasks/:employeeId', taskController_1.listTasks);
exports.default = router;
