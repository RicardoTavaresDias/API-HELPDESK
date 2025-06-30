import z from 'zod'

// Schema Email
export const emailSchema = z.string({ message: "Campo somente string" })
  .min(1, { message: "Campo obrigatório" })
  .email({ message: "E-mail inválido" })

export type EmailSchemaType = z.infer<typeof emailSchema>


// Schema User
export const userSchema = z.object({
  name: z.string({ message: "Campo somente string" })
  .min(1, { message: "Campo obrigatório" })
  .regex(/^[a-zA-Z\s]*$/, { message: "Campo nome deve conter apenas letras e espaços." })
  .transform((name) => {
    return name
      .trim()
      .split(" ")
      .map((word) => {
        return word[0].toUpperCase().concat(word.substring(1));
      }).join(" ")
  }),
  email: emailSchema,
  password: z.string({ message: "Campo somente string" })
  .min(6, { message: "Preencha o campo com pelo menos 6 caracteres" })
})
export type UserSchematype = z.infer<typeof userSchema>


// Schema Technical
export const technicalSchema = z.object({
  ...userSchema.shape,
  role: z.enum(["technical"]),
  userHours: z.array(z.object({
    startTime: z.coerce.date({ message: "startTime Inválido" }),
    endTime: z.coerce.date({ message: "endTime Inválido" })
  }))
  .min(1, { message: "Deve ter pelo menos um cronograma" })
})
export type TechnicalSchemaType = z.infer<typeof technicalSchema>


// Schema UUID
export const uuidSchema = z.string().uuid({ message: "Id invalido." })




