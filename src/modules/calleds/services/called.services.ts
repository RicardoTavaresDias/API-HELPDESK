import Repository from "@/repositories"

export const createCalled = async () => {
  const repository = new Repository()
  return await repository.called.create()
}