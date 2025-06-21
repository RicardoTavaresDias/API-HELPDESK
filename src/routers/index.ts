import { Router } from "express";
import { authRouter } from "./auth.router";
import { userRouter } from "./user.router";

export const router = Router()

router.use("/", authRouter)
router.use("/user", userRouter)