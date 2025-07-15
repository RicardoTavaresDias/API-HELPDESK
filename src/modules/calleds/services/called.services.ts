import Repository from "@/repositories"
import { type CreateCalledsSchemaType, IndexUserSchemaType, UpdateStatusCalledSchemaType, idUpdateServicesSchemaType, idServicesType } from "../schemas/called.schema"
import type { InputCalled } from "../types/calleds-response"
import { pagination } from "@/libs/pagination"
import { refactorObjectData } from "../utils/refactor-object-data"

export const createCalled = async (data: CreateCalledsSchemaType) => {
  const repository = new Repository()
  return await repository.called.create(data)
}

export const indexByCalled = async (id: number) => {
  const repository = new Repository()
  const resultDb =  await repository.called.indexAll({ id })

  const data = refactorObjectData(resultDb as InputCalled[] | [])
  return data
}

export const indexAllCalled = async (data: { page: number, limit: number }) => {
  const repository = new Repository()
  const indexAllCout = await repository.called.indexAllCout()
  const resultPagination = pagination(data.page, indexAllCout, data.limit)
  const { skip, ...rest } = resultPagination

  const resultDb = await repository.called.indexAll({ skip: skip, take: data.limit })
  const resultMap = refactorObjectData(resultDb as InputCalled[] | [])

  return {
    result: rest,
    data: resultMap
  }
}

export const indexUser = async (data: { page: number, limit: number } & IndexUserSchemaType) => {
  const repository = new Repository()
  const indexUserCout = await repository.called.indexUserCout({ id: data.id, role: data.role })
  const resultPagination = pagination(data.page, indexUserCout, data.limit)
  const { skip, ...rest } = resultPagination

  const resultDb =  await repository.called.indexUserAll({ skip: skip, take: data.limit, id: data.id, role: data.role })
  return {
    result: rest,
    data: resultDb
  }
}

export const updateStatus = async ({ id, status }: UpdateStatusCalledSchemaType) => {
  const repository = new Repository()
  return await repository.called.updateStatusCalled({ id, status })
}

export const createServicesCalled = async (data: idUpdateServicesSchemaType) => {
  const repository = new Repository()
  return await repository.called.createServices(data)
}

export const removeServicesCalled = async (data: idServicesType) => {
  const repository = new Repository()
  return await repository.called.removeServices(data)
}