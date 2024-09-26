"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeAuth_1 = require("../controllers/employeeAuth");
const employeeController_1 = require("../controllers/employeeController");
const upload_1 = __importDefault(require("../middlewares/upload"));
// import { updatePicture } from '../controllers/employeeController';
const router = express_1.default.Router();
// employee Login
router.post("/login", employeeAuth_1.employeeLogin);
// update Profile
router.put("/editprofile/:userId", upload_1.default.single("profilePhoto"), employeeController_1.updateProfile);
// update reset with link
router.post("/reqest-reset-password/:userId", employeeController_1.resetPassRequest);
// update password
router.post("/reset-password", employeeController_1.ChangePassword);
// employee dashboard data
router.get('/dashboard/:userId', employeeController_1.dashboardData);
// user data for vedio call page 
router.get('/userdata/:userId', employeeController_1.employeedetails);
// sending otp for email 
router.post('/resetEmail/:userId', employeeController_1.resetEmail);
// updating email 
router.post('/updateEmail/:userId', employeeController_1.setNewEmail);
exports.default = router;
