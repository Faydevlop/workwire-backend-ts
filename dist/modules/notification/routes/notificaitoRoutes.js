"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const router = express_1.default.Router();
router.post('/', notificationController_1.createNotification);
router.get('/:userId', notificationController_1.checkNotification);
// getting leatest notification list
router.get('/getlist/:currentUserId', notificationController_1.getUsersSortedByLastMessage);
// getting normal messages
router.get('/getnotify/:userId', notificationController_1.eachUserNotification);
exports.default = router;
