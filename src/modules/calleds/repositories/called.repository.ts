import { PrismaClient } from "@prisma/client";

export class CalledRepository {
  prisma: PrismaClient

  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }

  async create(){ 
    return await this.prisma.called.create({
      data: {
        fkUserCustomer: "7165a110-f039-4a1e-b4e0-8dc56a467e7e",
        fkUserTechnical: "34147b4b-c113-482e-85fc-5730148b5d11",
        titleCalled: "Teste chamado novo",
        description: "Descrição de um chamado novo para teste.",
        services: {
          create: [ // Fazer map para incluir mais de um services id.
            {
              services: {
                connect: { id: "539907e8-63be-41b1-b12e-5ac1df897313" }
              },
            },
            {
              services: {
                connect: { id: "fe199343-35aa-47e1-8195-58682df00159" }
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