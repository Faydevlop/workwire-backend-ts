import express , {Router} from 'express'
import { createMeeting, deleteMeeting, findusers, listUser, meetinglist, nextmeet } from '../controller/MeetingController';
const router:Router = express.Router();

// Adding New Meeting
router.post('/addmeeting/:userId',createMeeting);
// listing users - add meeting form
router.get('/listuser/:userId',findusers)
// listing meeting details - manager
router.get('/listmeeting/:userId',listUser)
// delete meeting
router.post('/deletemeeting/:meetingId',deleteMeeting)
// show the details of the next meet
router.get('/nextmeet',nextmeet)

// listing meeting details for employees
router.get('/listmeeting/:userId/employee',meetinglist)


export default router