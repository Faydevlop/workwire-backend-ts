import express,{Router} from 'express'
import { createComment, listComments, updatestatus } from '../controllers/commentController';

const router:Router = express.Router();

// Create comment
router.post('/addcomment/:taskId',createComment)
// list comments based on the tasks
router.get('/listcomments/:taskId',listComments)
// update the the status based on the action
router.put('/updatestatus/:id',updatestatus)



export default router