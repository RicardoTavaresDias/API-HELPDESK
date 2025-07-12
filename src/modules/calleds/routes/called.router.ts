import { Router } from "express";
import { CalledsController } from "../controllers/called.controller"

export const calledRouter = Router()
const calledsController = new CalledsController()

calledRouter.get("/", calledsController.create)