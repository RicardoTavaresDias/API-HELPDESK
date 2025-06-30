import { Request, Response, NextFunction } from "express"
import { userAuth } from "../services/auth.services"
import { authUserSchema } from "../schemas/auth.schema"

export class Auth {
  async session(request: Request, response: Response, next: NextFunction){
    const authSchema = authUserSchema.safeParse(request.body)
    if(!authSchema.success){
      return response.status(400).json({ message: authSchema.error.issues[0].message })
    }

    try {
      const result = await userAuth(authSchema.data)
      response.status(200).json(result)
    } catch (error: any){
      next(error)
    }
  }
}