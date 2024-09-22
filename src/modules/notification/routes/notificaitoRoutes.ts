import express, { Router } from "express";
import { checkNotification, createNotification, getUsersSortedByLastMessage } from "../controllers/notificationController";
const router: Router = express.Router();

router.post('/',createNotification)

router.get('/:userId',checkNotification)
// getting leatest notification list
router.get('/getlist/:currentUserId',getUsersSortedByLastMessage)

export default router;