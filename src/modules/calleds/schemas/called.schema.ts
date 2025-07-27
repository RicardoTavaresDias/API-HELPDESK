import z from "zod"

export const createCalledsSchema = z.object({
  idCustomer: z.string().uuid(),
  dateCustomer: z.string(),
  hourCustomer: z.string(),
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

export type CreateCalledsSchemaType = z.infer<typeof createCalledsSchema>

export const indexUserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["customer", "technical"])
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