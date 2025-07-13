import z from "zod"

export const createCalledsSchema = z.object({
  idCustomer: z.string().uuid(),
  idTechnical: z.string().uuid().optional(),
  titleCalled: z.string().min(1, { message: "Campo Título obrigatório" }),
  description: z.string().min(1, { message: "Campo Descrição obrigatório" }),
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