import express , {Router} from 'express'
import { createMeeting, deleteMeeting, findusers, includedMeetingList, listforEdit, listingallUser, listUser, meetinglist, nextmeet, updateMeeting } from '../controller/MeetingController';
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
// listing for editpage
router.get('/listmeeiting/:meetingId/list',listforEdit)
// meet update route
router.put('/update/:meetId',updateMeeting)

// hr - admin usege routes
// listing all users for add user
router.get('/listallUsers',listingallUser)
// listing of included list manager - hr - admin
router.get('/listincludedmeet/:userId',includedMeetingList)

// listing meeting details for employees
router.get('/listmeeting/:userId/employee',meetinglist)


export default router