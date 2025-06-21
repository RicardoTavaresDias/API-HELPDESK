import { Request, Response } from "express";
import { createUserCustomer, createUserTechnical } from "../services/user-service";

export class UserController {
  async createCustomer(request: Request, response: Response){
    await createUserCustomer(request.body)
    response.status(200).json({ message: "Registration completed successfully" })
  }

  async createTechnical(request: Request, response: Response){
    await createUserTechnical(request.body)
    response.status(200).json({ message: "Registration completed successfully" })
  }
}