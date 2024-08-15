import express, { Router } from "express";
import { employeeLogin } from "../controllers/employeeAuth";
import {
  ChangePassword,
  resetPassRequest,
  updateProfile,
} from "../controllers/employeeController";
import upload from "../middlewares/profileUpload";
import { protect } from "../../../middlewares/jwtMiddleware";
// import { updatePicture } from '../controllers/employeeController';

const router: Router = express.Router();

// employee Login
router.post("/login", employeeLogin);
// update Profile
router.put(
  "/editprofile/:userId",
  upload.single("profilePhoto"),protect,
  updateProfile
);
// update reset with link
router.post("/reqest-reset-password/:userId", resetPassRequest);
// update password
router.post("/reset-password", ChangePassword);

export default router;
