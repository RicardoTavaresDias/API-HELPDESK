import z from "zod"

export const servicesSchema = z.object({
  title: z.string({ message: "Campo somente string" })
  .min(1, { message: "Campo obrigatório" })
  .transform(title => title[0].toUpperCase().concat(title.substring(1))),
  price: z.string({ message: "Campo somente string" })
  .min(1, { message: "Campo obrigatório" })
  .transform(value => {
    return parseFloat(value.replace(".", "").replace(",", ".")) 
  })
})

export type ServicesSchema = z.infer<typeof servicesSchema>

export const statusServicesEnum = z.enum(["active", "inactive"], { message: "Status inválido: use 'active' ou 'inactive'" }).optional()
export type StatusServicesEnum = z.infer<typeof statusServicesEnum>


export const updateSchema = z.object({
  ...servicesSchema.shape,
  status: statusServicesEnum
})

export type UpdateSchemaType = z.infer<typeof updateSchema>