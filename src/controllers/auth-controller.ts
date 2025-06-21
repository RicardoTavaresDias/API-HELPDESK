import { Request, Response } from "express"
import { userAuth } from "../services/auth-services"

export class Auth {
  async session(request: Request, response: Response){
    const result = await userAuth(request.body)
    if(!result){
      return response.status(404).json({ message: "unregistered user" })
    }

    response.status(200).json(result)
  }
}