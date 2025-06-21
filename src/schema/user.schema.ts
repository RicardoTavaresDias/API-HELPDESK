import z from 'zod'
import { UserCustomerType, UserTechnicalType } from '../services/user-service'

//ok
export const userSchema = (email: string) => {
  const isUserSchema = z.object({
    email: z.string({ message: "string only field" })
    .min(1, { message: "required field" })
    .email({ message: "invalid email" })
  })
 
  return isUserSchema.safeParse({ email })
}

//ok
export const userCustomerSchema = (data: UserCustomerType) => {
  const customerSchema = z.object({
    name: z.string({ message: "string only field" })
    .min(1, { message: "required field" }),
    email: z.string({ message: "string only field" })
    .min(4, { message: "fill in the field with at least 4 characters" })
    .email({ message: "invalid email" }),
    password: z.string({ message: "string only field" })
    .min(1, { message: "required field" })
  })

  return customerSchema.safeParse(data)
}

//ok
export const userTechnicalSchema = (data: UserTechnicalType) => {
  const technicalSchema = z.object({
    name: z.string({ message: "string only field" })
    .min(1,{ message: "required field" }),
    email: z.string({ message: "string only field" })
    .min(1, { message: "required field" })
    .email({ message: "invalid email" }),
    password: z.string({ message: "string only field" })
    .min(4,{ message: "fill in the field with at least 4 characters" }),
    role: z.enum(["technical"]),
    hours: z.array(z.object({
      startTime: z.coerce.date({ message: "invalid startTime" }),
      endTime: z.coerce.date({ message: "invalid endTime" })
    })).min(1, { message: "must have at least one schedule" })
  })

  return technicalSchema.safeParse(data)
}

 




