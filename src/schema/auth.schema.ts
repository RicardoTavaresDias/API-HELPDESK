import { authType } from "../services/auth-services"
import z from "zod"

export const existUser = (data: authType) => {
 const userSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(4)
 })

 return userSchema.safeParse(data)
}