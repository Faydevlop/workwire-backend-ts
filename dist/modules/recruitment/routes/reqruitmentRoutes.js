"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requirementController_1 = require("../controller/requirementController");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = express_1.default.Router();
// creating job post 
router.post('/createpost', requirementController_1.createRecruitment);
// listing jobs
router.get('/listitems', requirementController_1.listrquirements);
// delete job listings
router.delete('/deleteitem/:listId', requirementController_1.deleteItem);
// refer job route - post
router.post('/referjob', upload_1.default.single('resume'), requirementController_1.referJob);
// listing jobs
router.get('/listJob', requirementController_1.listIReq);
// listing sepecific details of the req details
router.get('/listDetails/:reqId', requirementController_1.listspecific);
// delete job applications 
router.delete('/deleteapplication/:applicationId', requirementController_1.deleteJobapplications);
// listing data for edit form
router.get('/getdata/:jobId', requirementController_1.getUserData);
// update job listing data form - post
router.put('/update/:jobId', requirementController_1.updataJonlist);
exports.default = router;
