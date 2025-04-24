import { Router } from "express";
import registerUser from "../controllers/user.controllers.js";
const router = Router();
import { upload } from "../moddlewares/multer.middleware.js";
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
// router.route("/login").post(registerUser);


export default router;
