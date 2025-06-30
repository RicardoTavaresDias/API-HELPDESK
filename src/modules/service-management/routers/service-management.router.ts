import { Router } from "express";
import { ServicesController } from "../controllers/service-management.controller";
import { ensureAuthenticated } from "../../../middlewares/ensureAuthenticated";
import { userAuthorization } from "../../../middlewares/userAuthorization";

export const servicesRouter = Router()
const servicesController = new ServicesController()

servicesRouter.use(ensureAuthenticated)
servicesRouter.get("/", userAuthorization(["admin", "technical"]), servicesController.index)
servicesRouter.post("/", userAuthorization(["admin"]), servicesController.create)
servicesRouter.patch("/:id", userAuthorization(["admin"]), servicesController.update)