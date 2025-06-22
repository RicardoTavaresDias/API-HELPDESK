import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken"
import { authConfig } from "../config/jwt";

type TokenPayload = {
  id: string
  name: string
  role: string
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction){
  try {
    const authHeader = request.headers.authorization
    if(!authHeader) return response.status(401).json({ message: "JWT token not found" })

    const token = authHeader.split(" ")[1]
    const { user }: any = verify(token, authConfig.jwt.secret) as TokenPayload
    
    request.user = {
      id: user.id,
      name: user.name,
      role: user.role
    }

    next()
  } catch(error){
    response.status(401).json({ messsage: "Invalid JWT token" })
  }
}