import express , {Router} from 'express'
import { HrLogin } from '../controllers/HrAuth'

const router:Router = express.Router()

// Hr Login
router.post('/login',HrLogin)

export default router