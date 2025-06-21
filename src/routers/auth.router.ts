import { Router } from "express";
import { Auth } from "../controllers/auth-controller";

const authController = new Auth()
export const authRouter = Router()

authRouter.post("/", authController.session)