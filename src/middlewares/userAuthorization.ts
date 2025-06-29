import { Request, Response, NextFunction } from "express"
import { AppError } from "../utils/AppError"
import {uuidSchema } from "../schema/user.schema"

function userAuthorization(role: string[]){
  return (request: Request, response: Response, next: NextFunction) => {
    if(!request.user) {
      throw new AppError("Não autorizado", 403)
    }

    if(!role.includes(request.user.role)){
      throw new AppError("Não autorizado", 403) 
    }

    return next()
  }
}


const validateUserId = (request: Request, response: Response, next: NextFunction) => {
  const uuid = uuidSchema.safeParse(request.params.id)
  if(!uuid.success){
    throw new AppError(uuid.error.issues[0].message, 400)
  }
 
  if(uuid.data !== request.user?.id && request.user?.role !== "admin"){
      return response.status(403).json({ message: "Acesso negado. Você não tem permissão para acessar este usuário." })
    }
  
  next()
}

export { userAuthorization, validateUserId }