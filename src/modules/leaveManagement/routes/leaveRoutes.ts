import express , {Router} from 'express'
import { createLeave } from '../controllers/leaveController';

const router:Router = express.Router();

router.post('/applyLeave',createLeave)

export default router