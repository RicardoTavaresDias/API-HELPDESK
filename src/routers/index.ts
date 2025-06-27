import { Router } from "express";
import { authRouter } from "./auth.router";
import { userRouter } from "./user.router";
import { servicesRouter } from "./services.router";

export const router = Router()

router.use("/", authRouter)
router.use("/user", userRouter)
router.use("/services", servicesRouter)