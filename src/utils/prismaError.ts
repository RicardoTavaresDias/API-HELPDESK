type ErrorPrismaType = {
  code: string
  startCode: number
  message: string
}

export const errorPrisma: ErrorPrismaType[] = [
  { code: "P2002", startCode: 409, message: "Um recurso com este valor já existe." },
  { code: "P2025", startCode: 404, message: "Recurso não encontrado." },
  { code: "P2003", startCode: 400, message: "Violação de relacionamento de dados." },
  { code: "P2014", startCode: 400, message: "Violação de relacionamento de dados." }
]