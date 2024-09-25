"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaveController_1 = require("../controllers/leaveController");
const router = express_1.default.Router();
// create or apply leave
router.post('/applyLeave', leaveController_1.createLeave);
// list all leaves - admin
router.get('/getAllLeaves', leaveController_1.listingLeaves);
// list user specific requests - employee , manager 
router.get('/getleaves/:userId', leaveController_1.listingleavesforUser);
// leave status managing
router.post('/status/:leaveId', leaveController_1.changeStatus);
// leave page listing data
router.get('/listdata', leaveController_1.leavepageListingdatas);
// list deatils of leave request
router.get('/getdetails/:leaveId', leaveController_1.listdetails);
// leave management for manager to manage leave requests of the employees
router.get('/managerleaveget/:managerId', leaveController_1.managerLeaveMng);
exports.default = router;
