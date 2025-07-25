import Repository from "../../../repositories"
import { AppError } from "../../../utils/AppError"
import jwt from "jsonwebtoken";
import { authConfig } from "../../../config/jwt";
import { compare } from "bcrypt"
import type { UserTokenReturn } from "../../../types/token"

export type authType = {
  email: string
  password: string
}

export const userAuth = async (data: authType) => {
  const repository = new Repository()
  const resultUser = await repository.user.isUser({ userEmail: data.email })
  if(!resultUser) throw new AppError("Usuário não registrado", 404)

  const passwordMatched = await compare(data.password, resultUser.password)
  if(!passwordMatched) throw new AppError("E-mail ou senha incorretos.", 401)

  const token = userToken(resultUser as any)
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


const userToken = (data: userPrismaType): UserTokenReturn => {
  const { password, ...rest } = data
  const { secret, expiresIn } = authConfig.jwt

  const token = jwt.sign({ user: { id: rest.id, name: rest.name, role: rest.role }}, 
    secret, 
    { expiresIn: expiresIn }
  )

  return { user: rest, token }
}