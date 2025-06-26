import { Request, Response, NextFunction } from "express";
import { createUserCustomer, createUserTechnical, listAll, removerUser, updateUser } from "../services/user-service";

export class UserController {
  async createCustomer(request: Request, response: Response, next: NextFunction){
    try {
      await createUserCustomer(request.body)
      response.status(201).json({ message: "Cadastro concluído com sucesso" })
    } catch(error: any){
      next(error)
    }
  }

  async createTechnical(request: Request, response: Response, next: NextFunction){
    try {
      await createUserTechnical(request.body)
      response.status(201).json({ message: "Cadastro concluído com sucesso" })
    } catch(error: any){
      next(error)
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await listAll()
      if(!users.length){
        return response.status(404).json({ message: "Usuários não encontrado." })
      }
      response.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      if(!Object.keys(request.body).length){
        return response.status(401).json({ message: "Não há dados para atualizar." })
      }

      const dataUpdate = request.body
      const idUser = request.params.id
      
      const data = request.file ? { ...dataUpdate, avatar: request.file.filename } : dataUpdate
      await updateUser({ id: idUser, dataUpdate: data})
      response.status(200).json({ message: "Dados atualizado com sucesso" })
    } catch (error) {
      next(error)
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.params.id
      if(!id){
        return response.status(401).json({ message: "Informe id do usuário" })
      }
      await removerUser(id)
      response.status(200).json({ message: "Usuário excluido com sucesso." })
    } catch (error) {
      next(error)
    }
  }
}