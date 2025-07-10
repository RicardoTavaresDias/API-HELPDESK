import { pagination } from "@/libs/pagination"
import Repository from "@/repositories"
import { emailSchema } from "../schemas/user.schema"
import type { EmailSchemaType, TechnicalSchemaType, UserSchematype} from "../schemas/user.schema"
import { AppError } from "@/utils/AppError"
import { hash } from "bcrypt"
import fs from "node:fs"

export const existUser = async (email: EmailSchemaType) => {
  const repository = new Repository()
  const isUser = emailSchema.safeParse(email)
  if(!isUser.success){
    throw new AppError(isUser.error.issues[0].message, 400)
  }

  return await repository.user.isUser({ userEmail: isUser.data })
}

export const createUserCustomer = async (data: UserSchematype) => {
  const userExist = await existUser(data.email)
  if(!userExist){
    const repository = new Repository()
    const hashPassword =  await hash(data.password, 12)
    return await repository.user.createCustomer({...data, password: hashPassword})
  }
  
  throw new AppError("Usuário já registrado", 409)
}

export const createUserTechnical  = async (data: TechnicalSchemaType) => {
  const userExist = await existUser(data.email)
  if(!userExist){
    const repository = new Repository()
    const hashPassword =  await hash(data.password, 12)
    return await repository.user.createTechnical({...data, password: hashPassword})
  }

  throw new AppError("Usuário já registrado", 409)
}

export const listAll = async (data: {page: number, limit: number, role: "customer" | "technical" }) => {
  const repository = new Repository()
  const userCount = await repository.user.coutUser(data.role)
  const result = pagination(data.page, userCount, data.limit)
  const { skip, ...rest } = result

  const usersAll = await repository.user.indexAll({ skip: skip, take: data.limit, role: data.role })
    return { 
    result: rest, 
    data: usersAll 
  }
}

export const indexByUser = async (id: string) => {
  const repository = new Repository()
  const byUser = await repository.user.isUser({ id })
  if(!byUser){
    throw new AppError("Usuários não encontrado.", 404)
  }

  const {  password, role, createdAt, updatedAt, ...rest } = byUser

  return rest
}

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

export const updateUser = async ({ id, dataUpdate }: { id: string, dataUpdate: UpdateUserType }) => {
  const dataUser: UpdateUserType = dataUpdate
  if(dataUser.password) dataUser.password = await hash(dataUser.password, 12) 
  if(dataUpdate.avatar){
    dataUser.avatar = dataUpdate.avatar
  }

  const repository = new Repository()
  
  const existUser = await repository.user.isUser({ id })
  if(!existUser) throw new AppError("Usuários não encontrado.", 404)
  
  if(existUser.role === "customer" && dataUser.userHours){
    throw new AppError("Clientes não possuem horas de atendimento associadas.", 403)
  }
 
  return await repository.user.update({ id, dataUpdate: dataUser })
}

export const removerUser = async (id: string) => {
  const repository = new Repository()
  const existUser = await repository.user.isUser({ id })
  if(!existUser){
    throw new AppError("Usuários não encontrado.", 404)
  }

  return await repository.user.remove(id)
}

export const removeAvatar = async (id: string) => {
  const repository = new Repository()
  const existUser = await repository.user.isUser({ id })
  if(!existUser){
    throw new AppError("Usuários não encontrado.", 404)
  }

  if(!fs.existsSync(`./upload/${existUser.avatar}`)){
    throw new AppError("Arquivo não encontrado.", 404)
  }

  fs.unlinkSync(`./upload/${existUser.avatar}`)
  
  const result = await repository.user.update({ id, dataUpdate: { avatar: "default.svg" } })

  return { result }
}