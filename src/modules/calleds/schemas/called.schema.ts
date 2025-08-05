import z from "zod"
import { dayjs } from "@/libs/dayjs"

export const createCalledsSchema = z.object({
  idCustomer: z.string().uuid(),
  dateCustomer: z.string()
    .min(1, { message: "Campo obrigatório" })
    .refine((value) => dayjs(value).isSame(dayjs(), "day") || dayjs(value).isAfter(dayjs(), "day"), { message: "Data informado incorreto."}),

  hourCustomer: z.string()
    .min(1, { message: "Campo obrigatório" }),

  titleCalled: z.string()
  .min(1, { message: "Campo Título obrigatório" })
  .transform(title => title[0].toUpperCase().concat(title.substring(1))),
  
  description: z.string()
  .min(1, { message: "Campo Descrição obrigatório" })
  .transform(description => description[0].toUpperCase().concat(description.substring(1))),

  idServices: z.array(z.object({ 
    id: z.string().uuid() 
  }))
  .min(1, { message: "Deve ter pelo menos um serviço cadastrado." }),
})
  .refine(date => {
    if(dayjs.tz(dayjs().tz("America/Sao_Paulo").format(`${date.dateCustomer}T${date.hourCustomer}`), "America/Sao_Paulo")
      .isSameOrBefore(dayjs().tz("America/Sao_Paulo"), "hour")){
      return false
    }
    return true
  }, {
    path: ["hourCustomer", "dateCustomer"], 
    message: "data e hora incorretos." 
  })

export type CreateCalledsSchemaType = z.infer<typeof createCalledsSchema>

export const indexUserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["customer", "technical"]),
  status: z.enum(["open", "close", "in_progress"]).optional()
})

export type IndexUserSchemaType = z.infer<typeof indexUserSchema>

export const updateStatusCalledSchema = z.object({
  id: z.coerce.number(),
  status: z.enum(["open", "close", "in_progress"])
})

export type UpdateStatusCalledSchemaType = z.infer<typeof updateStatusCalledSchema>

export const idUpdateServicesSchema = z.object({
  idCalled: z.coerce.number(),
  idServices: z.string().uuid()
})

export type idUpdateServicesSchemaType = z.infer<typeof idUpdateServicesSchema>
export type idServicesType = z.infer<typeof idUpdateServicesSchema>

export const createCalledCommentShema = z.object({
  idCalled: z.coerce.number(),
  idUser: z.string().uuid(),
  description: z.string().min(1, {  message: "Campo Descrição obrigatório" }),
  type: z.enum(["followUp", "task"])
})

export type CreateCalledCommentType = z.infer<typeof createCalledCommentShema>

export const updateCalledCommentShema = z.object({
  description: z.string().min(1, {  message: "Campo Descrição obrigatório" }).optional(),
  type: z.enum(["followUp", "task"]).optional()
})

export type UpdateCalledCommentType = z.infer<typeof updateCalledCommentShema>