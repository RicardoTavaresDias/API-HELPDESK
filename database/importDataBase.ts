import fs from "node:fs"
import { PrismaClient } from "@prisma/client";

async function exportMain () {
  if(!fs.existsSync("./database/db/backup.json")){
    return console.log("Backup não encontrado.")
  }

  const prisma = new PrismaClient()

  try {
    const dataBackup = await fs.promises.readFile("./database/db/backup.json")  
    const { 
      user,
      userHours,
      called,
      services,
      comments,
      called_Services,
      called_Comments
    } = await JSON.parse(dataBackup as any)

    for (const users of user) {
      await prisma.user.create({ data: users })
    }

    for (const userHour of userHours) {
      await prisma.userHours.create({ data: userHour })
    }

    for (const service of services) {
      await prisma.services.create({ data: service })
    }

    for (const calleds of called) {
      await prisma.called.create({ data: calleds })
    }

    for (const called_Service of called_Services) {
      await prisma.calledServices.create({ data: called_Service })
    }

    for (const comment of comments) {
      await prisma.comments.create({ data: comment })
    }

    for (const called_Comment of called_Comments) {
      await prisma.calledComments.create({ data: called_Comment })
    }

    console.log("Dados importado com sucesso no banco de dados.")
  } catch (error) {
    console.log("Não foi possivel realizar importação.")
  } finally {
    prisma.$disconnect()
  }
}

exportMain()