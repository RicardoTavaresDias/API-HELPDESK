import { servicesSchema, statusServicesEnum, updateSchema } from "../schemas/service-management.schema"
import { AppError } from "@/utils/AppError"
import type { ServicesSchema, StatusServicesEnum, UpdateSchemaType } from "../schemas/service-management.schema"
import Repository from "@/repositories"
import { pagination } from "@/libs/pagination"

export const createServices = async ({ title, value }: ServicesSchema) => {
  const services = servicesSchema.safeParse({ title, value })
    if(!services.success){
      throw new AppError(services.error.issues[0].message , 400)
    }

    const repository = new Repository()
    const serviceExistTitle = await repository.services.existServices({ title })
    if(serviceExistTitle.length){
      throw new AppError("Já existe um serviço cadastrado com esse título", 409);
    }

    return await repository.services.create(services.data)  
}

export const listServices = async (query: { page:string, limit: string, status: StatusServicesEnum }) => {
  const statusSchema = statusServicesEnum.safeParse(query.status)
  if(!statusSchema.success){
    throw new AppError(statusSchema.error.issues[0].message , 400)
  }

  const repository = new Repository()
  const cout = await repository.services.coutServices()

  const { page, limit, status } = query
  const result = pagination(Number(page), cout, Number(limit))
  const { skip, ...rest } = result

  const listServices =  await repository.services.list({ skip, take: Number(limit), status })  
  return {
    result: rest,
    data: listServices
  }
}


export const updateServices = async ({ id, data }: { id: string, data: UpdateSchemaType }) => {
  const schemaOptional = updateSchema.partial()
  const schemaUpdate = schemaOptional.safeParse(data)
  if(!schemaUpdate.success){
    throw new AppError(schemaUpdate.error.issues[0].message , 400)
  }

  const repository = new Repository()
  const existId =  await repository.services.idUpdateExist(id)
  if(!existId.length){
    throw new AppError("ID inválido: serviço não existe", 404);
  }

  return await repository.services.update({ id, data: schemaUpdate.data as UpdateSchemaType})
} 