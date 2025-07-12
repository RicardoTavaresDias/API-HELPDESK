import { Request, Response, NextFunction } from "express"; 
import { createCalled } from "../services/called.services"

export class CalledsController {
  async create(request: Request, response: Response, next: NextFunction){
    const result = await createCalled()

    response.status(200).json(result)
  }
}