import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentpassword,
  getCurrentUser,
  updateUserDetails,
  updateCoverImage,
  updateAvatarImage,
  getUserChannelProfile,
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
router.route("/change-password").post(verifyJWT, changeCurrentpassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
// patch means update one thing not all
router.route("/update-account").patch(verifyJWT, updateUserDetails);
router
  .route("/update-coverImage")
  .post(verifyJWT, upload.single("coverImage"), updateCoverImage);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateAvatarImage);
router.route("/channel");

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

export default router;
