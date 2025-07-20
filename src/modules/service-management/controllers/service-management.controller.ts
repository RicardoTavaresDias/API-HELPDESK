import { Request, Response, NextFunction } from "express";
import { ServicesManagement } from "../services/service-management.service";
import type { StatusServicesEnum } from "../schemas/service-management.schema"
import { servicesSchema, statusServicesEnum, updateSchema } from "../schemas/service-management.schema"
import type { UpdateSchemaType } from "../schemas/service-management.schema"

const servicesManagement = new ServicesManagement()

export class ServicesController {
  async create(request: Request, response: Response, next: NextFunction){
    const services = servicesSchema.safeParse(request.body)
    if(!services.success){
      return response.status(400).json({ message: services.error.issues[0].message })
    }

    try {
      await servicesManagement.createServices(services.data)
      return response.status(201).json({ message: "Serviço cadastrado com sucesso." })
    }catch(error) {
      next(error)
    } 
  }

  async index(request: Request, response: Response, next: NextFunction){
    const statusSchema = statusServicesEnum.safeParse(request.query.status)
    if(!statusSchema.success){
      return response.status(400).json({ message: statusSchema.error.issues[0].message })
    }

    const { page, limit } = request.query
    if(!page || !Number(page) || (!limit || !Number(limit))){
      return response.status(400).json({ 
        message: "'page' e 'limit' são obrigatórios e devem ser números inteiros válidos na query string." 
      })
    }

    try {
      const indexServices = await servicesManagement.listServices(request.query as { page: string, limit: string, status: StatusServicesEnum })
      response.status(200).json(indexServices)
    } catch(error) {
      next(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction){
    if(!Object.keys(request.body).length){
      return response.status(401).json({ message: "Não há dados para atualizar." })
    }

    const schemaOptional = updateSchema.partial()
    const schemaUpdate = schemaOptional.safeParse(request.body)
    if(!schemaUpdate.success){
      return response.status(400).json({ message: schemaUpdate.error.issues[0].message })
    }

    try {
      await servicesManagement.updateServices(
        { id: request.params.id, data: schemaUpdate.data } as { id: string, data: UpdateSchemaType }
      )
      response.status(200).json({ message: "Dados atualizado com sucesso" })
    } catch (error) {
      next(error)
    }
  }
}