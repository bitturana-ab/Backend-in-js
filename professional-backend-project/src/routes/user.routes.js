import { Router } from "express";
import registerUser, {
  loginUser,
  logoutUser,
} from "../controllers/user.controllers.js";
const router = Router();
import { upload } from "../moddlewares/multer.middleware.js";
import { verifyJWT } from "../moddlewares/auth.middleware.js";
// use upload fields middleware in route post method
router
  .route("/register")
  .post(
    upload.fields(
      { name: "avatar", maxCount: 1 },
      { name: "coverImage", maxCount: 1 }
    ),
    registerUser
  );

// route for login using user controller with async handler
router.route("/login").post(loginUser);

// secure routes
// user jwt verify middleware for logout
router.route("/logout").post(verifyJWT, logoutUser);

export default router;
