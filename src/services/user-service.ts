import { pagination } from "../libs/pagination"
import Repository from "../repositories"
import { emailSchema, technicalSchema, userSchema } from "../schema/user.schema"
import type { EmailSchemaType, TechnicalSchemaType, UserSchematype} from "../schema/user.schema"
import { AppError } from "../utils/AppError"
import { hash } from "bcrypt"

export const existUser = async (email: EmailSchemaType) => {
  const repository = new Repository()
  const isUser = emailSchema.safeParse(email)
  if(!isUser.success){
    throw new AppError(isUser.error.issues[0].message, 400)
  }

  return await repository.user.isUser({ userEmail: isUser.data })
}

export const createUserCustomer = async (data: UserSchematype) => {
  const userCustomer = userSchema.safeParse(data)
  if(!userCustomer.success){
    throw new AppError(userCustomer.error.issues[0].message, 400)
  }

  const userExist = await existUser(userCustomer.data.email)
  if(!userExist){
    const repository = new Repository()
    const hashPassword =  await hash(userCustomer.data.password, 12)
    return await repository.user.createCustomer({...userCustomer.data, password: hashPassword})
  }
  
  throw new AppError("Usuário já registrado", 409)
}

export const createUserTechnical  = async (data: TechnicalSchemaType) => {
  const userTechnical = technicalSchema.safeParse(data)
  if(!userTechnical.success){
    throw new AppError(userTechnical.error.issues[0].message , 400)
  }

  const userExist = await existUser(userTechnical.data.email)
  if(!userExist){
    const repository = new Repository()
    const hashPassword =  await hash(userTechnical.data.password, 12)
    return await repository.user.createTechnical({...userTechnical.data, password: hashPassword})
  }

  throw new AppError("Usuário já registrado", 409)
}

export const listAll = async (data: {page: number, limit: number}) => {
  const repository = new Repository()
  const userCount = await repository.user.coutUser()
  const result = pagination(data.page, userCount, data.limit)
  const { skip, ...rest } = result

  const usersAll = await repository.user.indexAll({ skip: skip, take: data.limit })

  return { 
    result: rest, 
    data: usersAll 
  }
}

export type UpdateUserType = {
  name?: string
  email?: string
  password?: string
  avatar?: string
  hours?: {
    startTime: Date
    endTime: Date
  }[]
} 

export const updateUser = async ({ id, dataUpdate }: { id: string, dataUpdate: UpdateUserType }) => {
  const newSchema = technicalSchema.partial()
  const user = newSchema.safeParse(dataUpdate)
  if(!user.success){
    throw new AppError(user.error.issues[0].message , 400)
  }
 
  const dataUser: UpdateUserType = user.data
 
  if(dataUser.password) dataUser.password = await hash(dataUser.password, 12) 
  if(dataUpdate.avatar){
    dataUser.avatar = dataUpdate.avatar
  }

  const repository = new Repository()
  
  const existUser = await repository.user.isUser({ id })
  if(!existUser) throw new AppError("Usuários não encontrado.", 404)
  
  if(existUser.role === "customer" && user.data.hours){
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