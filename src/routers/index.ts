import { Router } from "express";
import { authRouter } from "@/modules/auth/routers/auth.router";
import { userRouter } from "@/modules/users/routers/user.router";
import { servicesRouter } from "@/modules/service-management/routers/service-management.router";
import { calledRouter } from "@/modules/calleds/routes/called.router"

export const router = Router()

router.use("/", authRouter)
router.use("/user", userRouter)
router.use("/services", servicesRouter)
router.use("/calleds", calledRouter)