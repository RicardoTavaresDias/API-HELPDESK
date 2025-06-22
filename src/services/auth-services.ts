import Repository from "../repositories"
import { authUserSchema } from "../schema/auth.schema"
import { AppError } from "../utils/AppError"
import jwt from "jsonwebtoken";
import { authConfig } from "../config/jwt";
import { compare } from "bcrypt"
import { UserCustomerType } from "./user-service";

export type authType = {
  email: string
  password: string
}

export const userAuth = async (data: authType) => {
  const userAuthSchema = authUserSchema(data)
  if(!userAuthSchema.success){
    throw new AppError(userAuthSchema.error.flatten().fieldErrors as string, 401)
  }

  const repository = new Repository()
  const resultUser = await repository.user.isUser(data.email) as UserCustomerType
  if(!resultUser) throw new AppError("unregistered user", 401)

  const passwordMatched = await compare(data.password, resultUser.password)
  if(!passwordMatched) throw new AppError("Incorrect username and password", 401)

  const token = userToken(resultUser as userPrismaType)
  return token
}

type userPrismaType = {
  id: string
  name: string
  email: string
  password: string 
  role: string
  avatar: string
  createdAt: Date
  updatedAt: Date
  userHours?: [{startTime: Date, endTime: Date}][]
} 

const userToken = (data: userPrismaType) => {
  const { password, ...rest } = data
  const { secret, expiresIn } = authConfig.jwt

  const token = jwt.sign({ user: { id: rest.id, name: rest.name, role: rest.role }}, 
    secret, 
    { expiresIn: expiresIn }
  )

  return { user: rest, token }
}