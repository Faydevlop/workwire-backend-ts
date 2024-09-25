"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MeetingController_1 = require("../controller/MeetingController");
const router = express_1.default.Router();
// Adding New Meeting
router.post('/addmeeting/:userId', MeetingController_1.createMeeting);
// listing users - add meeting form
router.get('/listuser/:userId', MeetingController_1.findusers);
// listing meeting details - manager
router.get('/listmeeting/:userId', MeetingController_1.listUser);
// delete meeting
router.post('/deletemeeting/:meetingId', MeetingController_1.deleteMeeting);
// show the details of the next meet
router.get('/nextmeet', MeetingController_1.nextmeet);
// listing for editpage
router.get('/listmeeiting/:meetingId/list', MeetingController_1.listforEdit);
// meet update route
router.put('/update/:meetId', MeetingController_1.updateMeeting);
// hr - admin usege routes
// listing all users for add user
router.get('/listallUsers', MeetingController_1.listingallUser);
// listing of included list manager - hr - admin
router.get('/listincludedmeet/:userId', MeetingController_1.includedMeetingList);
// listing meeting details for employees
router.get('/listmeeting/:userId/employee', MeetingController_1.meetinglist);
exports.default = router;
