import { authType } from "../services/auth-services"
import z from "zod"

export const authUserSchema = (data: authType) => {
 const userSchema = z.object({
    email: z.string({ message: "Campo somente string" })
    .min(1, { message: "Campo obrigatório" })
    .email({ message: "E-mail inválido" }),
    password: z.string({ message: "Campo somente string" })
    .min(6, { message: "Preencha o campo com pelo menos 6 caracteres" })
 })

 return userSchema.safeParse(data)
}