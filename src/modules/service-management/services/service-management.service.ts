import { AppError } from "@/utils/AppError"
import type { ServicesSchema, StatusServicesEnum, UpdateSchemaType } from "../schemas/service-management.schema"
import Repository from "@/repositories"
import { pagination } from "@/libs/pagination"

class ServicesManagement {
  repository = new Repository()

  async createServices ({ title, price }: ServicesSchema) {
    const serviceExistTitle = await this.repository.services.existServices({ title })
    if(serviceExistTitle.length){
      throw new AppError("Já existe um serviço cadastrado com esse título", 409);
    }

    return await this.repository.services.create({ title, price })  
  }

  async listServices (query: { page:string, limit: string, status: StatusServicesEnum }) {
    const cout = await this.repository.services.coutServices()

    const { page, limit, status } = query
    const result = pagination(Number(page), cout, Number(limit))
    const { skip, ...rest } = result

    const listServices =  await this.repository.services.list({ skip, take: Number(limit), status })  
    return {
      result: rest,
      data: listServices
    }
  }

  async updateServices ({ id, data }: { id: string, data: UpdateSchemaType }) {
    const existId =  await this.repository.services.idUpdateExist(id)
    if(!existId.length){
      throw new AppError("ID inválido: serviço não existe", 404);
    }

    return await this.repository.services.update({ id, data: data as UpdateSchemaType})
  } 
}

export { ServicesManagement }