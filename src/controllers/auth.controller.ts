import { Request, Response } from "express"

export class Auth {
  session(request: Request, response: Response){
    response.status(200).json({ message: "Hello Word." })
  }
}