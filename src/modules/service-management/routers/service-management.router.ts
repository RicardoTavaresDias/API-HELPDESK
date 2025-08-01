import { Router, Request, Response } from "express";
import { ServicesController } from "../controllers/service-management.controller";
import { ensureAuthenticated } from "../../../middlewares/ensureAuthenticated";
import { userAuthorization } from "../../../middlewares/userAuthorization";
import { basePrice } from "@/libs/basePrice"

export const servicesRouter = Router()
const servicesController = new ServicesController()

servicesRouter.use(ensureAuthenticated)
servicesRouter.get("/base", servicesController.servicesBasePrice)
servicesRouter.get("/", userAuthorization(["admin", "technical", "customer"]), servicesController.index)
servicesRouter.post("/", userAuthorization(["admin"]), servicesController.create)
servicesRouter.patch("/:id", userAuthorization(["admin"]), servicesController.update)