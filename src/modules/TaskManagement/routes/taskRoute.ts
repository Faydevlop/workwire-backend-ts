import express , {Router} from 'express'
import { CreateTask, deleteTask, listAttachments, listTasks, listUsers, taskdetails, uploadAttachments } from '../controllers/taskController';
import upload from '../../recruitment/middlewares/upload';

const router:Router = express.Router();

// create task route
router.post('/createtask/:ProjectId',CreateTask);
// listing users for task creating
router.get('/listUsers/:ProjectId',listUsers)
// list task details 
router.get(`/taskdetails/:taskId`,taskdetails)
// listing tasks based on employee
router.get('/listtasks/:employeeId',listTasks)
// route for attach files
router.post('/attachments/:taskId',upload.single('attachments'),uploadAttachments)
// route for geting attachment based on the task id
router.get('/attach/:taskId',listAttachments)
// delete task route
router.post('/deletetask/:taskId',deleteTask)



export default router