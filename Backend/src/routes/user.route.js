import { Router } from "express";
import {
  register,
  verifyCode,
  login,
  logout,
  getMe,
  changeToggleForTheAcceptanceMSG,
  getAcceptStatus,
  deleteAccount,
  checkUsernameUnique,
  getPublicAcceptStatus
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/verify-code").post(verifyCode);
router.route("/login").post(login);
router.route("/check-username").get(checkUsernameUnique);

router.route("/logout").get(verifyJWT, logout);
router.route("/me").get(verifyJWT, getMe);
router.route("/delete-account").delete(verifyJWT, deleteAccount);
router.route("/change-toggle").patch(verifyJWT, changeToggleForTheAcceptanceMSG);
router.route("/accept-status").get(verifyJWT, getAcceptStatus);
router.get("/accept-status/:username", getPublicAcceptStatus);

export default router;