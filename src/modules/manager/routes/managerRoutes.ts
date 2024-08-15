import express , {Router} from 'express'
import { managerLogin } from '../constrollers/managerAuth'


const router:Router = express.Router()

// manager Login
router.post('/login',managerLogin)


export default router
