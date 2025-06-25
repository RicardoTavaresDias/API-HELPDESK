import z from 'zod'
import { UserCustomerType, UserTechnicalType } from '../services/user-service'

export const userSchema = (email: string) => {
  const isUserSchema = z.object({
    email: z.string({ message: "Campo somente string" })
    .min(1, { message: "Campo obrigatório" })
    .email({ message: "E-mail inválido" })
  })
 
  return isUserSchema.safeParse({ email })
}

export const userCustomerSchema = (data: UserCustomerType) => {
  const customerSchema = z.object({
    name: z.string({ message: "Campo somente string" })
    .min(1, { message: "Campo obrigatório" }),
    email: z.string({ message: "Campo somente string" })
    .min(1, { message: "Campo obrigatório" })
    .email({ message: "E-mail inválido" }),
    password: z.string({ message: "Campo somente string" })
    .min(6, { message: "Preencha o campo com pelo menos 6 caracteres" })
  })

  return customerSchema.safeParse(data)
}

export const userTechnicalSchema = (data: UserTechnicalType) => {
  const technicalSchema = z.object({
    name: z.string({ message: "Campo somente string" })
    .min(1,{ message: "Campo obrigatório" }),
    email: z.string({ message: "Campo somente string" })
    .min(1, { message: "Campo obrigatório" })
    .email({ message: "E-mail inválido" }),
    password: z.string({ message: "Campo somente string" })
    .min(6,{ message: "Preencha o campo com pelo menos 6 caracteres" }),
    role: z.enum(["technical"]),
    hours: z.array(z.object({
      startTime: z.coerce.date({ message: "startTime Inválido" }),
      endTime: z.coerce.date({ message: "endTime Inválido" })
    })).min(1, { message: "Deve ter pelo menos um cronograma" })
  })

  return technicalSchema.safeParse(data)
}

 




