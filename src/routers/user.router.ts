import { Router } from "express";
import express from "express"
import { UserController } from "../controllers/user-controller";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import { userAuthorization, validateUserId } from "../middlewares/userAuthorization";

import { upload } from "../config/multer"

const userController = new UserController()
export const userRouter = Router()

userRouter.post("/customer", userController.createCustomer)

userRouter.use(ensureAuthenticated)
userRouter.post("/technical", userAuthorization(["admin"]), userController.createTechnical)
userRouter.get("/:id", validateUserId, userController.showUser)
userRouter.get("/list/:role", userAuthorization(["admin"]), userController.index)
userRouter.patch("/:id", validateUserId, upload.single('file'), userController.update)
userRouter.delete("/:id", validateUserId, userAuthorization(["admin", "customer"]), userController.remove)

userRouter.use("/avatar", express.static("./upload"))