import express , {Router} from 'express'
import { createRecruitment, deleteItem, listIReq, listrquirements, listspecific, referJob } from '../controller/requirementController';
import upload from '../middlewares/upload'
const router:Router = express.Router();

// creating job post 
router.post('/createpost',createRecruitment)
// listing jobs
router.get('/listitems',listrquirements);
// delete job listings
router.delete('/deleteitem/:listId',deleteItem)
// refer job route - post
router.post('/referjob',upload.single('resume'),referJob)
// listing jobs
router.get('/listJob',listIReq) 
// listing sepecific details of the req details
router.get('/listDetails/:reqId',listspecific)





export default router