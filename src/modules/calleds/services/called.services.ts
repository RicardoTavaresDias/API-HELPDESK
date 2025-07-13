import Repository from "@/repositories"
import { type CreateCalledsSchemaType, IndexUserSchemaType } from "../schemas/called.schema"
import { pagination } from "@/libs/pagination"

export const createCalled = async (data: CreateCalledsSchemaType) => {
  const repository = new Repository()
  return await repository.called.create(data)
}

export const indexAllCalled = async (data: { page: number, limit: number }) => {
  const repository = new Repository()
  const indexAllCout = await repository.called.indexAllCout()
  const resultPagination = pagination(data.page, indexAllCout, data.limit)
  const { skip, ...rest } = resultPagination

  const resultDb = await repository.called.indexAll({ skip: skip, take: data.limit })
  return {
    result: rest,
    data: resultDb
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