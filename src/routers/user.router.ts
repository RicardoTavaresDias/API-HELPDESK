import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";

const userController = new UserController()
export const userRouter = Router()

userRouter.use(ensureAuthenticated)
userRouter.post("/cliente", userController.createCustomer)
userRouter.post("/tecnico", userController.createTechnical)