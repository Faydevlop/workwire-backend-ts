import express , {Router} from 'express'
import { CreateTask, listTasks, listUsers, taskdetails } from '../controllers/taskController';

const router:Router = express.Router();

// create task route
router.post('/createtask/:ProjectId',CreateTask);
// listing users for task creating
router.get('/listUsers/:ProjectId',listUsers)
// list task details 
router.get(`/taskdetails/:taskId`,taskdetails)
// listing tasks based on employee
router.get('/listtasks/:employeeId',listTasks)



export default router