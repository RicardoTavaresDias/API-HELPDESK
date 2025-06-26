import Repository from "../repositories"
import { userCustomerSchema, userSchema, userTechnicalSchema } from "../schema/user.schema"
import { AppError } from "../utils/AppError"
import { UserRole } from "@prisma/client"
import { hash } from "bcrypt"

export const existUser = async (email: string) => {
  const repository = new Repository()
  const resultIsUserSchema = userSchema(email)
  if(!resultIsUserSchema.success){
    throw new AppError(resultIsUserSchema.error.issues[0].message, 400)
  }

  return await repository.user.isUser(email)
}

export type UserCustomerType = {
  name: string
  email: string
  password: string
}

export const createUserCustomer = async (data: UserCustomerType) => {
  const resultUserCustomerSchema = userCustomerSchema(data)
  if(!resultUserCustomerSchema.success){
    throw new AppError(resultUserCustomerSchema.error.issues[0].message, 400)
  }

  const userExist = await existUser(data.email)
  if(!userExist){
    const repository = new Repository()
    const hashPassword =  await hash(data.password, 12)
    return await repository.user.createCustomer({...data, password: hashPassword})
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
  const resultUserTechnicalSchema = userTechnicalSchema(data)
  if(!resultUserTechnicalSchema.success){
    throw new AppError(resultUserTechnicalSchema.error.issues[0].message , 400)
  }

  const userExist = await existUser(data.email)
  if(!userExist){
    const respository = new Repository()
    const hashPassword =  await hash(data.password, 12)
    return await respository.user.createTechnical({...data, password: hashPassword})
  }

  throw new AppError("Usuário já registrado", 409)
}