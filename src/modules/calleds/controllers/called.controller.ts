import { Request, Response, NextFunction } from "express"; 
import { createCalled, indexAllCalled, indexUser } from "../services/called.services"
import { createCalledsSchema, indexUserSchema } from "../schemas/called.schema"

export class CalledsController {
  async create(request: Request, response: Response, next: NextFunction){
    try {
      const createSchema = createCalledsSchema.safeParse(request.body)
      if(!createSchema.success){
        return response.status(401).json({ message: createSchema.error.issues[0].message })
      }

      const result = await createCalled(createSchema.data)
      response.status(201).json({ message: "Chamado criado com sucesso." })
    }catch(error){
      next(error)
    }
  }

  

  async indexAll(request: Request, response: Response, next: NextFunction) {
    const { page, limit } = request.query
    if(!page || !Number(page) || (!limit || !Number(limit))){
      return response.status(400).json({ 
        message: "'page' e 'limit' são obrigatórios e devem ser números inteiros válidos na query string." 
      })
    } 

    try {
      const result = await indexAllCalled({ page: Number(page), limit: Number(limit) })
      response.status(200).json(result)
    }catch(error){
      next(error)
    }
  }

  async indexUser(request: Request, response: Response, next: NextFunction){
    const { page, limit } = request.query
    if(!page || !Number(page) || (!limit || !Number(limit))){
      return response.status(400).json({ 
        message: "'page' e 'limit' são obrigatórios e devem ser números inteiros válidos na query string." 
      })
    } 

    try {
      const userSchema = indexUserSchema.safeParse(request.user)
      if(!userSchema.success){
        return response.status(401).json({ message: userSchema.error.issues[0].message })
      }

      const result = await indexUser({
         page: Number(page), 
         limit: Number(limit), 
         id: userSchema.data.id, 
         role: userSchema.data.role 
      })
      
      response.status(200).json(result)
    }catch(error){
      next(error)
    }
  }
}