import { Repository } from "../repositories"
import { userCustomerSchema, userSchema, userTechnicalSchema } from "../schema/user.schema"
import { AppError } from "../utils/AppError"
import { UserRole } from "@prisma/client"
import { hash } from "bcrypt"

// ok
export const existUser = async (email: string) => {
  const repository = new Repository()
  const resultIsUserSchema = userSchema(email)
  if(!resultIsUserSchema.success){
    throw new AppError(resultIsUserSchema.error.flatten().fieldErrors as string, 401)
  }

  return await repository.user.isUser(email)
}


export type UserCustomerType = {
  name: string 
  email: string
  password: string
}

// ok
export const createUserCustomer = async (data: UserCustomerType) => {
  const resultUserCustomerSchema = userCustomerSchema(data)
  if(!resultUserCustomerSchema.success){
    throw new AppError(resultUserCustomerSchema.error.flatten().fieldErrors as string, 401)
  }

  const userExist = await existUser(data.email)
  if(!userExist){
    const repository = new Repository()
    const hashPassword =  await hash(data.password, 12)
    return await repository.user.createCustomer({...data, password: hashPassword})
  }
  
  throw new AppError("user already registered", 401)
}

export type UserTechnicalType = {
  role: UserRole
  hours: {
    startTime: Date
    endTime: Date
  }[]
} & UserCustomerType

//ok
export const createUserTechnical  = async (data: UserTechnicalType) => {
  const resultUserTechnicalSchema = userTechnicalSchema(data)
  if(!resultUserTechnicalSchema.success){
    throw new AppError(resultUserTechnicalSchema.error.flatten().fieldErrors as string, 401)
  }

  const userExist = await existUser(data.email)
  if(!userExist){
    const respository = new Repository()
    const hashPassword =  await hash(data.password, 12)
    return await respository.user.createTechnical({...data, password: hashPassword})
  }

  throw new AppError("user already registered", 401)
}