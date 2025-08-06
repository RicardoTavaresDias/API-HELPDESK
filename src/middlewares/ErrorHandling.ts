import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { errorPrisma } from "../utils/prismaError"

export function ErrorHandling(error: any, request: Request, response: Response, next: NextFunction) {
  if(error instanceof AppError){
    response.status(error.statusCode).json({ message: error.message })
    return
  }

  if(error instanceof ZodError){
    response.status(400).json({ message: "validation error",  issues: error.format() })
    return
  }

  if(error instanceof PrismaClientKnownRequestError){
    const [ err ] = errorPrisma.filter(value => value.code === error.code)
    if(!err){
      return response.status(400).json({ message: error.meta })
    } 
    
    response.status(err.startCode).json({ message: err.message, error: error.meta })
    return
  }
  
  response.status(500).json({ message: error.message })
}