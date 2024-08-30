import express , {Router} from 'express'
import { changeStatus, createLeave, leavepageListingdatas, listdetails, listingLeaves, listingleavesforUser, managerLeaveMng } from '../controllers/leaveController';

const router:Router = express.Router();

// create or apply leave
router.post('/applyLeave',createLeave)
// list all leaves - admin
router.get('/getAllLeaves',listingLeaves);
// list user specific requests - employee , manager 
router.get('/getleaves/:userId',listingleavesforUser)
// leave status managing
router.post('/status/:leaveId',changeStatus)
// leave page listing data
router.get('/listdata',leavepageListingdatas)
// list deatils of leave request
router.get('/getdetails/:leaveId',listdetails);
// leave management for manager to manage leave requests of the employees
router.get('/managerleaveget/:managerId',managerLeaveMng)

export default router