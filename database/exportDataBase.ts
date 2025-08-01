import fs from "node:fs"
import { PrismaClient } from "@prisma/client";

async function exportMain () {
  if(!fs.existsSync("./database/db")){
    fs.mkdirSync("./database/db", { recursive: true })
  }

  const prisma = new PrismaClient()

  try {
    const user = await prisma.user.findMany()
    const userHours = await prisma.userHours.findMany()

    const called = await prisma.called.findMany()
    const services = await prisma.services.findMany()
    const comments = await prisma.comments.findMany()

    const called_Services = await prisma.calledServices.findMany()
    const called_Comments = await prisma.calledComments.findMany()

    await fs.promises.writeFile("./database/db/backup.json", JSON.stringify({ 
      user,
      userHours,
      called,
      services,
      comments,
      called_Services,
      called_Comments
    }, null, 2))

    console.log("Backup realizado com sucesso.")
  } catch (error) {
    console.log("Erro ao salvar no arquivo.")
  }finally {
    prisma.$disconnect()
  }
}

exportMain()