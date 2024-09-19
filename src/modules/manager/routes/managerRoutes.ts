import express , {Router} from 'express'
import { ManagerDashboard, managerLogin } from '../constrollers/managerAuth'


const router:Router = express.Router()

// manager Login
router.post('/login',managerLogin)
// manager dashboard
router.get('/dashboard/:managerId',ManagerDashboard)


export default router
