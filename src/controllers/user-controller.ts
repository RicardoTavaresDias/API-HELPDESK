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
    const { page, limit } = request.query
    if(!page || !Number(page) || (!limit || !Number(limit))){
      return response.status(400).json({ 
        message: "'page' e 'limit' são obrigatórios e devem ser números inteiros válidos na query string." 
      })
    } 

    try {
      const users = await listAll({ page: Number(page), limit: Number(limit) })
      if(!users.usersAll){
        return response.status(404).json({ message: "Usuários não encontrado." })
      }
      response.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  /**
   * 
   * const [form, setForm] = useState({
      name: 'Jussara',
      email: 'jussara@email.com',
      password: '123456',
      role: 'technical',
      hours: [
        {
          startTime: "2025-06-21T17:08:00.003Z",
          endTime: "2025-06-21T17:12:00.003Z"
        },
        {
          startTime: "2025-06-21T17:14:00.003Z",
          endTime: "2025-06-21T17:18:00.003Z"
        }
      ]
    });
   * 
   * Envia o JSON como campo de texto (igual no Insomnia)
   * formData.append("data", JSON.stringify(form)); <= passando objeto para body
   * 
   * formData.append("file", avatarFile)
   * 
   * const response = await fetch("http://localhost:3333/user", {
        method: "PATH",
        body: formData,
      });
   *
   *   
   */

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      if(!Object.keys(request.body).length){
        return response.status(401).json({ message: "Não há dados para atualizar." })
      }

      const dataUpdate = JSON.parse(request.body.data)
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