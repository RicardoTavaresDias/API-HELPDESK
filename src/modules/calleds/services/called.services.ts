import Repository from "@/repositories"
import { type CreateCalledsSchemaType, IndexUserSchemaType, UpdateStatusCalledSchemaType, idUpdateServicesSchemaType, idServicesType } from "../schemas/called.schema"
import type { InputCalled } from "../types/calleds-response"
import { pagination } from "@/libs/pagination"
import { refactorObjectData } from "../utils/refactor-object-data"

class ServiceCalled {
  repository = new Repository()

  async createCalled (data: CreateCalledsSchemaType) {
    return await this.repository.called.create(data)
  }

  async indexByCalled (id: number) {
    const resultDb =  await this.repository.called.indexAll({ id })

    const data = refactorObjectData(resultDb as InputCalled[] | [])
    return data
  }

  async indexAllCalled (data: { page: number, limit: number }) {
    const indexAllCout = await this.repository.called.indexAllCout()
    const resultPagination = pagination(data.page, indexAllCout, data.limit)
    const { skip, ...rest } = resultPagination

    const resultDb = await this.repository.called.indexAll({ skip: skip, take: data.limit })
    const resultMap = refactorObjectData(resultDb as InputCalled[] | [])

    return {
      result: rest,
      data: resultMap
    }
  }

  async indexUser (data: { page: number, limit: number } & IndexUserSchemaType) {
    const indexUserCout = await this.repository.called.indexUserCout({ id: data.id, role: data.role })
    const resultPagination = pagination(data.page, indexUserCout, data.limit)
    const { skip, ...rest } = resultPagination

    const resultDb =  await this.repository.called.indexUserAll({ skip: skip, take: data.limit, id: data.id, role: data.role })
    return {
      result: rest,
      data: resultDb
    }
  }

  async updateStatus ({ id, status }: UpdateStatusCalledSchemaType) {
    return await this.repository.called.updateStatusCalled({ id, status })
  }

  async createServicesCalled (data: idUpdateServicesSchemaType) {
    return await this.repository.called.createServices(data)
  }

  async removeServicesCalled (data: idServicesType) {
    return await this.repository.called.removeServices(data)
  }
}

export { ServiceCalled }