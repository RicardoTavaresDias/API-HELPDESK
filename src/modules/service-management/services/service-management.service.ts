import { AppError } from "@/utils/AppError"
import type { ServicesSchema, StatusServicesEnum, UpdateSchemaType } from "../schemas/service-management.schema"
import Repository from "@/repositories"
import { pagination } from "@/libs/pagination"

export const createServices = async ({ title, price }: ServicesSchema) => {
    const repository = new Repository()
    const serviceExistTitle = await repository.services.existServices({ title })
    if(serviceExistTitle.length){
      throw new AppError("Já existe um serviço cadastrado com esse título", 409);
    }

    return await repository.services.create({ title, price })  
}

export const listServices = async (query: { page:string, limit: string, status: StatusServicesEnum }) => {
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
  const repository = new Repository()
  const existId =  await repository.services.idUpdateExist(id)
  if(!existId.length){
    throw new AppError("ID inválido: serviço não existe", 404);
  }

  return await repository.services.update({ id, data: data as UpdateSchemaType})
} 