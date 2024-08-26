import express , {Router} from 'express'
import { CreateTask, listUsers, taskdetails } from '../controllers/taskController';

const router:Router = express.Router();

// create task route
router.post('/createtask/:ProjectId',CreateTask);
// listing users for task creating
router.get('/listUsers/:ProjectId',listUsers)
// list task details 
router.get(`/taskdetails/:taskId`,taskdetails)



export default router