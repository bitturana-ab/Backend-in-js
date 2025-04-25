import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/user.controllers.js";
const router = Router();
import { upload } from "../moddlewares/multer.middleware.js";
import { verifyJWT } from "../moddlewares/auth.middleware.js";
// use upload fields middleware in route post method
router.route("/register").post(
  // here error solve after 3 days inside fields [] is missing for array error
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

// route for login using user controller with async handler
router.route("/login").post(loginUser);

// secure routes
// user jwt verify middleware for logout
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
