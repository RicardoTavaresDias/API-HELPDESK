import { Request, Response } from "express";
import { createUserCustomer, createUserTechnical } from "../services/user-service";

export class UserController {
  async createCustomer(request: Request, response: Response){
    try {
      await createUserCustomer(request.body)
      response.status(200).json({ message: "Registration completed successfully" })
    } catch(error: any){
      return response.status(error.statusCode).json({ error: error.message })
    }
  }

  async createTechnical(request: Request, response: Response){
    try {
      await createUserTechnical(request.body)
      response.status(200).json({ message: "Registration completed successfully" })
    } catch(error: any){
      return response.status(error.statusCode).json({ error: error.message })
    }
  }
}