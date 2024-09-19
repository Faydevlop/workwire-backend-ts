import express, { Router } from "express";
import { checkNotification, createNotification } from "../controllers/notificationController";
const router: Router = express.Router();

router.post('/',createNotification)

router.get('/:userId',checkNotification)

export default router;