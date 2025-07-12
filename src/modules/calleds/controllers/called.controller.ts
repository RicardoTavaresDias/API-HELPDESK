import { Request, Response, NextFunction } from "express"; 

export class CalledsController {
  create(request: Request, response: Response, next: NextFunction){
    response.status(200).json({ message: "OK" })
  }
}