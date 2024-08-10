import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
//api/v1/users/register
router
  .route("/register")
  .post(upload
      .fields([
        {
          name: "avatar",
          maxCounts: 1,
        },
        {
          name: "coverImage",
          maxCounts: 1,
        },
      ])
    , registerUser);
export default router;
