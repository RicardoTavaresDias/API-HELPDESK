import { authType } from "../services/auth-services"
import z from "zod"

export const authUserSchema = (data: authType) => {
 const userSchema = z.object({
    email: z.string({ message: "string only field" })
    .min(4, { message: "fill in the field with at least 4 characters" })
    .email({ message: "invalid email" }),
    password: z.string({ message: "string only field" })
    .min(6, { message: "fill in the field with at least 6 characters" })
 })

 return userSchema.safeParse(data)
}