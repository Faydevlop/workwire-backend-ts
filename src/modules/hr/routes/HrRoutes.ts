import express , {Router} from 'express'
import { hrDashboard, HrLogin } from '../controllers/HrAuth'

const router:Router = express.Router()

// Hr Login
router.post('/login',HrLogin)
// hr dashboard 
router.get('/dashboard/:userId',hrDashboard)

export default router