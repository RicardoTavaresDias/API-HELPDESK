import { Request, Response, NextFunction } from "express"; 
import { ServiceCalled } from "../services/called.services"
import { createCalledsSchema, indexUserSchema, updateStatusCalledSchema, idUpdateServicesSchema, idUpdateServicesSchema as idServices, createCalledCommentShema, updateCalledCommentShema } from "../schemas/called.schema"

const serviceCalled = new ServiceCalled()

export class CalledsController {
  async create(request: Request, response: Response, next: NextFunction){
    try {
      const createSchema = createCalledsSchema.safeParse(request.body)
      if(!createSchema.success){
        return response.status(401).json({ message: createSchema.error.issues[0].message })
      }
      
      const result = await serviceCalled.createCalled(createSchema.data) as { nameTecnical: string }      
      response.status(201).json({ message: `Chamado criado com sucesso, ${result.nameTecnical} atenderá seu chamado.` })
    }catch(error){
      next(error)
    }
  }

  async indexCalledId(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id
    if(!id){
      response.status(400).json({ message: "Id inválido." })
    }

    try {
      const result = await serviceCalled.indexByCalled(Number(id))
      response.status(200).json(result)
    }catch(error) {
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
      const result = await serviceCalled.indexAllCalled({ page: Number(page), limit: Number(limit) })
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
      const userSchema = indexUserSchema.safeParse({ ...request.user, status: request.query.status })
      if(!userSchema.success){
        return response.status(401).json({ message: userSchema.error.issues[0].message })
      }

      const result = await serviceCalled.indexUser({
         page: Number(page), 
         limit: Number(limit), 
         id: userSchema.data.id, 
         role: userSchema.data.role, 
         status: request.query.status as "open" | "close" | "in_progress"
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

      await serviceCalled.updateStatus({ id: updateSchema.data.id, status: updateSchema.data.status })
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

      await serviceCalled.createServicesCalled(idUpdateCalledServices.data)
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

      await serviceCalled.removeServicesCalled(dataId.data)
      response.status(200).json({ message: "Serviço removido com sucesso." })
    }catch(error) {
      next(error)
    }
  }

  async createComments(request: Request, response: Response, next: NextFunction){
    try {
      const createCommentsSchema = createCalledCommentShema.safeParse(request.body)
      if(!createCommentsSchema.success){
        return response.status(401).json({ message: createCommentsSchema.error.issues[0].message })
      }

      await serviceCalled.createComments(createCommentsSchema.data)
      response.status(201).json({ message: "Seu acompanhamneto criado com sucesso" })
    } catch (error) {
      next(error)
    }
  }

  async updateComments(request: Request, response: Response, next: NextFunction){
    try {
      if(!request.params.id){
        return response.status(400).json({ message: "Id inválido." })
      }

      const updateCommentsSchema = updateCalledCommentShema.safeParse(request.body)
      if(!updateCommentsSchema.success){
        return response.status(401).json({ message: updateCommentsSchema.error.issues[0].message })
      }

      const { description } = updateCommentsSchema.data

      await serviceCalled.updateComments({ 
        description: description, 
        commentid: request.params.id,
        userId: request.user?.id!
      })
      response.status(201).json({ message: "Seu Acompanhamento atualizado com sucesso" })

    } catch (error) {
      next(error)
    }
  }

  async removeComments(request: Request, response: Response, next: NextFunction){
    try {
      if(!request.params.id){
        return response.status(400).json({ message: "Id inválido." })
      }

      await serviceCalled.removeComments(request.params.id)
      response.status(201).json({ message: "Acompanhamento removido com sucesso" })

    } catch (error) {
      next(error)
    }
  }
}