import { Request, Response, NextFunction } from "express"; 
import { createCalled, indexAllCalled, indexUser, updateStatus, createServicesCalled, removeServicesCalled } from "../services/called.services"
import { createCalledsSchema, indexUserSchema, updateStatusCalledSchema, idUpdateServicesSchema, idUpdateServicesSchema as idServices } from "../schemas/called.schema"

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

      const data = result.data.map(called => {
        const priceTotal = called.services.reduce((acc, price) => acc + parseFloat(price.services.price.toString()), 0)
        return {
          ...called,
          priceTotal
        }
      })

      response.status(200).json({ result: result.result, data })
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

  async update(request: Request, response: Response, next: NextFunction){
    try {
      const updateSchema = updateStatusCalledSchema.safeParse({ id: request.params.idCalled, status: request.body.status })
      if(!updateSchema.success){
        return response.status(401).json({ message: updateSchema.error.issues[0].message })
      }

      await updateStatus({ id: updateSchema.data.id, status: updateSchema.data.status })
      response.status(200).json({ message: "Status do chamado atualizado com sucesso." })
    }catch(error) {
      next(error)
    }
  }

  async addServices(request: Request, response: Response, next: NextFunction) {
    try {
      const idUpdateCalledServices = idUpdateServicesSchema.safeParse(request.body)
      if(!idUpdateCalledServices.success){
        return response.status(401).json({ message: idUpdateCalledServices.error.issues[0].message })
      }

      await createServicesCalled(idUpdateCalledServices.data)
      response.status(200).json({ message: "Serviço adicionado com sucesso." })
    }catch(error) {
      next(error)
    }
  }

  async removeServices(request: Request, response: Response, next: NextFunction){
    try {
      const dataId = idServices.safeParse({ idCalled: request.params.idCalled, idServices: request.params.idServices })
      if(!dataId.success){
        return response.status(401).json({ message: dataId.error.issues[0].message })
      }

      await removeServicesCalled(dataId.data)
      response.status(200).json({ message: "Serviço removido com sucesso." })
    }catch(error) {
      next(error)
    }
  }
}