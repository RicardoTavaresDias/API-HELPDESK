import { Request, Response, NextFunction } from "express";
import { listServices, updateServices, createServices } from "../services/service-management.service";
import type { StatusServicesEnum } from "../schemas/service-management.schema"

export class ServicesController {
  async create(request: Request, response: Response, next: NextFunction){
    try {
      await createServices(request.body)
      return response.status(201).json({ message: "Serviço cadastrado com sucesso." })
    }catch(error) {
      next(error)
    } 
  }

  async index(request: Request, response: Response, next: NextFunction){
    const { page, limit } = request.query
    if(!page || !Number(page) || (!limit || !Number(limit))){
      return response.status(400).json({ 
        message: "'page' e 'limit' são obrigatórios e devem ser números inteiros válidos na query string." 
      })
    }

    try {
      const indexServices = await listServices(request.query as { page: string, limit: string, status: StatusServicesEnum })
      response.status(200).json(indexServices)
    } catch(error) {
      next(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction){
    if(!Object.keys(request.body).length){
      return response.status(401).json({ message: "Não há dados para atualizar." })
    }

    try {
      await updateServices({ id: request.params.id, data: request.body })
      response.status(200).json({ message: "Dados atualizado com sucesso" })
    } catch (error) {
      next(error)
    }
  }
}