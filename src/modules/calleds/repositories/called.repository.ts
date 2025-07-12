import { PrismaClient } from "@prisma/client";

export class CalledRepository {
  prisma: PrismaClient

  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }

  async create(){ 
    return await this.prisma.called.create({
      data: {
        fkUserCustomer: "7ba6163f-032c-4860-b6ee-25af7686a4c3",
        fkUserTechnical: "eb3532a9-4001-4670-940c-595b5e60df7f",
        titleCalled: "Teste chamado novo",
        description: "Descrição de um chamado novo para teste.",
        services: {
          create: [ // Fazer map para incluir mais de um services id.
            {
              services: {
                connect: { id: "4e1936f3-4d60-4455-b480-52f51631084f" }
              },
            },
            {
              services: {
                connect: { id: "c83fbc0a-fb7e-4f56-8863-fdc5941bd440" }
              }
            }
          ]
        }
      },
      include: {
        services: true
      }
    })

  }  
     
}