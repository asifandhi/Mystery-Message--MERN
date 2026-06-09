import { Router } from "express";
import {
  sendMessage,
  getMessages,
  deleteMessage,
  replyToMessage,
  checkMsgReplyThroughThread,
} from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/send/:username").post(sendMessage);
router.route("/thread/:threadToken").get(checkMsgReplyThroughThread); 


router.route("/").get(verifyJWT, getMessages);
router.route("/:messageId").delete(verifyJWT, deleteMessage);
router.route("/reply/:messageId").post(verifyJWT, replyToMessage);

export default router;