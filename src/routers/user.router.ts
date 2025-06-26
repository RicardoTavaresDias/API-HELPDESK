import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { userAuthorization } from "../middlewares/userAuthorization";

import { upload } from "../config/multer"

const userController = new UserController()
export const userRouter = Router()

userRouter.post("/customer", userController.createCustomer)
userRouter.post("/technical", ensureAuthenticated, userAuthorization(["admin"]), userController.createTechnical)
userRouter.get("/", userController.index)
userRouter.patch("/:id", upload.single('file'), userController.update)
userRouter.delete("/:id", userController.remove)
