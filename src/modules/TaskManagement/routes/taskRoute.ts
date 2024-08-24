import express , {Router} from 'express'
import { CreateTask, listUsers } from '../controllers/taskController';

const router:Router = express.Router();

// create task route
router.post('/createtask/:ProjectId',CreateTask);
// listing users for task creating
router.get('/listUsers/:ProjectId',listUsers)



export default router