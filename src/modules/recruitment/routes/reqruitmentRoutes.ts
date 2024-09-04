import express , {Router} from 'express'
import { createRecruitment, deleteItem, listrquirements } from '../controller/requirementController';
const router:Router = express.Router();

// creating job post 
router.post('/createpost',createRecruitment)
// listing jobs
router.get('/listitems',listrquirements);
// delete job listings
router.delete('/deleteitem/:listId',deleteItem)





export default router