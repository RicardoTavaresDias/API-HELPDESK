import { Repository } from "../repositories"
import { existUser } from "../schema/auth.schema"
import { AppError } from "../utils/AppError"

export type authType = {
  email: string
  password: string
}

export const userAuth = async (data: authType) => {
  const userAuthSchema = existUser(data)
  if(!userAuthSchema.success){
    throw new AppError(userAuthSchema.error.flatten().fieldErrors as string, 401)
  }

  const repository = new Repository()
  const resultUser = await repository.user.isUser(data.email)
 
  return resultUser
}