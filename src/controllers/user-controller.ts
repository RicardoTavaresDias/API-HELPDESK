import { Request, Response, NextFunction } from "express";
import { createUserCustomer, createUserTechnical } from "../services/user-service";

export class UserController {
  async createCustomer(request: Request, response: Response, next: NextFunction){
    try {
      await createUserCustomer(request.body)
      response.status(201).json({ message: "Registration completed successfully" })
    } catch(error: any){
      next(error)
    }
  }

  async createTechnical(request: Request, response: Response, next: NextFunction){
    try {
      await createUserTechnical(request.body)
      response.status(201).json({ message: "Registration completed successfully" })
    } catch(error: any){
      next(error)
    }
  }
}