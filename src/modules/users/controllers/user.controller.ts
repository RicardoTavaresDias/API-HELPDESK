import { Request, Response, NextFunction } from "express";
import { createUserCustomer, createUserTechnical, listAll, removerUser, updateUser, indexByUser, removeAvatar } from "../services/user.service";
import { technicalSchema, userSchema } from "../schemas/user.schema"

export class UserController {
  async createCustomer(request: Request, response: Response, next: NextFunction){
    try {
      const userCustomer = userSchema.safeParse(request.body)
        if(!userCustomer.success){
          return response.status(400).json({ message: userCustomer.error.issues[0].message })
        }

      await createUserCustomer(userCustomer.data)
      response.status(201).json({ message: "Cadastro concluído com sucesso" })
    } catch(error: any){
      next(error)
    }
  }

  async createTechnical(request: Request, response: Response, next: NextFunction){
    try {
      const userTechnical = technicalSchema.safeParse(request.body)
      if(!userTechnical.success){
        return response.status(400).json({ message: userTechnical.error.issues[0].message })
      }

      await createUserTechnical(userTechnical.data)
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

    if(request.params.role !== "technical" && request.params.role !== "customer"){
      return response.status(404).json({ message: "Usuários não encontrado." })
    }

    try {
      const users = await listAll({ page: Number(page), limit: Number(limit), role: request.params.role })
      if(!users.data){
        return response.status(404).json({ message: "Perfil inválido fornecido." })
      }
      response.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  async showUser(request: Request, response: Response, next: NextFunction) {
    try {
      const byUser = await indexByUser(request.params.id)
      response.status(200).json(byUser)
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
      if(!Object.keys(request.body).length && !request.file){
        return response.status(401).json({ message: "Não há dados para atualizar." })
      }

      const dataUpdate = request.body.data ? JSON.parse(request.body.data) : {}
      const idUser = request.params.id

      const newSchema = technicalSchema.partial()
      const user = newSchema.safeParse(dataUpdate)
      if(!user.success){
        return response.status(400).json({ message: user.error.issues[0].message })
      }

      const data = request.file ? { ...user.data, avatar: request.file.filename } : user.data
      const responseUpdateUser = await updateUser({ id: idUser, dataUpdate: data})
      response.status(200).json(responseUpdateUser)
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

  async removeAvatar(request: Request, response: Response, next: NextFunction) {
    try {
      const id = request.params.id
      if(!id){
        return response.status(401).json({ message: "Informe id do usuário" })
      }

      const resultRemove = await removeAvatar(id)

      response.status(200).json(resultRemove.result)
    } catch (error) {
      next(error)
    }
  }
}