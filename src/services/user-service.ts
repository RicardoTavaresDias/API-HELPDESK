import Repository from "../repositories"
import { userCustomerSchema, userSchema, userTechnicalSchema } from "../schema/user.schema"
import { AppError } from "../utils/AppError"
import { UserRole } from "@prisma/client"
import { hash } from "bcrypt"

export const existUser = async (email: string) => {
  const repository = new Repository()
  const isUser = userSchema(email)
  if(!isUser.success){
    throw new AppError(isUser.error.issues[0].message, 400)
  }

  return await repository.user.isUser(isUser.data.email)
}

export type UserCustomerType = {
  name: string
  email: string
  password: string
}

export const createUserCustomer = async (data: UserCustomerType) => {
  const userCustomer = userCustomerSchema(data)
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

export type UserTechnicalType = {
  role: UserRole
  hours: {
    startTime: Date
    endTime: Date
  }[]
} & UserCustomerType

export const createUserTechnical  = async (data: UserTechnicalType) => {
  const userTechnical = userTechnicalSchema(data)
  if(!userTechnical.success){
    throw new AppError(userTechnical.error.issues[0].message , 400)
  }

  const userExist = await existUser(userTechnical.data.email)
  if(!userExist){
    const respository = new Repository()
    const hashPassword =  await hash(userTechnical.data.password, 12)
    return await respository.user.createTechnical({...userTechnical.data, password: hashPassword})
  }

  throw new AppError("Usuário já registrado", 409)
}