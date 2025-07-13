import { Router } from "express";
import { ensureAuthenticated } from "../../../middlewares/ensureAuthenticated";
import { userAuthorization, validateUserId } from "../../../middlewares/userAuthorization";
import { CalledsController } from "../controllers/called.controller"

export const calledRouter = Router()
const calledsController = new CalledsController()

calledRouter.use(ensureAuthenticated)
calledRouter.post("/", userAuthorization(["admin", "customer"]), calledsController.create)
calledRouter.get("/", userAuthorization(["admin"]), calledsController.indexAll)
calledRouter.get("/user", calledsController.indexUser)