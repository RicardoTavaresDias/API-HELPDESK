import { Router } from "express";
import express from "express"
import { UserController } from "../controllers/user-controller";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { userAuthorization } from "../middlewares/userAuthorization";

import { upload } from "../config/multer"

const userController = new UserController()
export const userRouter = Router()

userRouter.post("/customer", userController.createCustomer)

userRouter.use(ensureAuthenticated)
userRouter.post("/technical", userAuthorization(["admin"]), userController.createTechnical)
userRouter.get("/:role", userAuthorization(["admin"]), userController.index)
userRouter.patch("/:id", upload.single('file'), userController.update)
userRouter.delete("/:id", userAuthorization(["admin", "customer"]), userController.remove)

userRouter.use("/avatar", express.static("./upload"))