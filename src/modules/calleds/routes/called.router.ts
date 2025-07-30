import { Router } from "express";
import { ensureAuthenticated } from "../../../middlewares/ensureAuthenticated";
import { userAuthorization } from "../../../middlewares/userAuthorization";
import { CalledsController } from "../controllers/called.controller"

export const calledRouter = Router()
const calledsController = new CalledsController()

calledRouter.use(ensureAuthenticated)
calledRouter.post("/", userAuthorization(["admin", "customer"]), calledsController.create)
calledRouter.get("/", userAuthorization(["admin"]), calledsController.indexAll)
calledRouter.get("/called/:id", userAuthorization(["admin", "technical", "customer"]), calledsController.indexCalledId)
calledRouter.get("/user", userAuthorization(["customer", "technical"]), calledsController.indexUser)
calledRouter.patch("/services", userAuthorization(["technical"]), calledsController.addServices)


calledRouter.post("/comment", userAuthorization(["admin", "technical"]), calledsController.createComments)
calledRouter.patch("/comment/:id", userAuthorization(["admin", "technical"]), calledsController.updateComments)
calledRouter.delete("/comment/:id", userAuthorization(["admin", "technical"]), calledsController.removeComments)



calledRouter.patch("/:idCalled",userAuthorization(["admin", "technical"]), calledsController.update)
calledRouter.delete("/:idCalled/:idServices", userAuthorization(["technical"]), calledsController.removeServices)