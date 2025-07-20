import { pagination } from "@/libs/pagination"
import Repository from "@/repositories"
import { emailSchema } from "../schemas/user.schema"
import type { EmailSchemaType, TechnicalSchemaType, UserSchematype} from "../schemas/user.schema"
import { AppError } from "@/utils/AppError"
import { hash, compare } from "bcrypt"
import fs from "node:fs"

export type UpdateUserType = {
  name?: string
  email?: string
  password?: string
  avatar?: string
  userHours?: {
    startTime: Date
    endTime: Date
  }[]
} 

class UserServices {
  repository = new Repository()

  async existUser (email: EmailSchemaType) {
    const isUser = emailSchema.safeParse(email)
    if(!isUser.success){
      throw new AppError(isUser.error.issues[0].message, 400)
    }

    return await this.repository.user.isUser({ userEmail: isUser.data })
  }

  async createUserCustomer (data: UserSchematype) {
    const userExist = await this.existUser(data.email)
    if(!userExist){
      const hashPassword =  await hash(data.password, 12)
      return await this.repository.user.createCustomer({...data, password: hashPassword})
    }
    
    throw new AppError("Usuário já registrado", 409)
  }

  async createUserTechnical (data: TechnicalSchemaType) {
    const userExist = await this.existUser(data.email)
    if(!userExist){
      const hashPassword =  await hash(data.password, 12)
      return await this.repository.user.createTechnical({...data, password: hashPassword})
    }

    throw new AppError("Usuário já registrado", 409)
  }

  
  async listAll (data: {page: number, limit: number, role: "customer" | "technical" }) {
    const userCount = await this.repository.user.coutUser(data.role)
    const result = pagination(data.page, userCount, data.limit)
    const { skip, ...rest } = result

    const usersAll = await this.repository.user.indexAll({ skip: skip, take: data.limit, role: data.role })
      return { 
      result: rest, 
      data: usersAll 
    }
  }

  async indexByUser (id: string) {
    const byUser = await this.repository.user.isUser({ id })
    if(!byUser){
      throw new AppError("Usuários não encontrado.", 404)
    }

    const {  password, role, createdAt, updatedAt, ...rest } = byUser

    return rest
  }

  async updateUser ({ id, dataUpdate }: { id: string, dataUpdate: UpdateUserType }) {
    const dataUser: UpdateUserType = dataUpdate
    
    const existUser = await this.repository.user.isUser({ id })
    if(!existUser) throw new AppError("Usuários não encontrado.", 404)
    
    if(dataUpdate.avatar){
      if(existUser.avatar !== "default.svg"){
        fs.unlinkSync(`./upload/${existUser.avatar}`)
      }
    
      dataUser.avatar = dataUpdate.avatar
    }
    
    if(existUser.role === "customer" && dataUser.userHours){
      throw new AppError("Clientes não possuem horas de atendimento associadas.", 403)
    }
  
    return await this.repository.user.update({ id, dataUpdate: dataUser })
  }

  async updatePassword ({ newPassword, oldPassaword, id }: { newPassword: string, oldPassaword: string, id: string }) {
    const dataUser = await this.repository.user.isUser({ id })
    if(!dataUser) throw new AppError("Usuários não encontrado.", 404)

    const validationPassword = await compare(oldPassaword, dataUser?.password!)
    if(!validationPassword) {
      throw new AppError("Senha atual incorreto.", 401)
    }

    const newPasswordHash = await hash(newPassword, 12)
    return this.repository.user.update({ id, dataUpdate: { password: newPasswordHash } })
  }

  async  removerUser (id: string) {
    const existUser = await this.repository.user.isUser({ id })
    if(!existUser){
      throw new AppError("Usuários não encontrado.", 404)
    }

    return await this.repository.user.remove(id)
  }

  async removeAvatar (id: string) {
    const existUser = await this.repository.user.isUser({ id })
    if(!existUser){
      throw new AppError("Usuários não encontrado.", 404)
    }

    if(!fs.existsSync(`./upload/${existUser.avatar}`)){
      throw new AppError("Arquivo não encontrado.", 404)
    }

    fs.unlinkSync(`./upload/${existUser.avatar}`)
    
    const result = await this.repository.user.update({ id, dataUpdate: { avatar: "default.svg" } })

    return { result }
  }
}

export { UserServices }