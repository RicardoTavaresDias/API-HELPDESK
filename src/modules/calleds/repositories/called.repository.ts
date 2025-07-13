import { PrismaClient } from "@prisma/client";

export class CalledRepository {
  prisma: PrismaClient

  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }

  async create(){ 
    // const create =  await this.prisma.called.create({
    //   data: {
    //     fkUserCustomer: "c3a37d4d-4dc9-4324-9747-ff0eb1175cde",
    //     fkUserTechnical: "f72c548e-103e-480e-97e1-e627a3ba335c",
    //     titleCalled: "Teste chamado novo",
    //     description: "Descrição de um chamado novo para teste.",
    //     services: {
    //       create: [ // Fazer map para incluir mais de um services id.
    //         {
    //           services: {
    //             connect: { id: "04e3239c-7e3a-43a5-8adb-4aba49094c64" }
    //           },
    //         },
    //         {
    //           services: {
    //             connect: { id: "67dd6f63-c40f-40d0-ad08-dfbc66722561" }
    //           }
    //         }
    //       ]
    //     }
    //   },
    //   include: {
    //     services: true
    //   }
    // })

    const index =  await this.prisma.called.findMany({
      select: {
        updatedAt: true,
        id: true,
        titleCalled: true,
        services: {
          select: {
            services: {
              select: {
                id: true,
                titleService: true,
                price: true
              }
            }
          }
        },
        UserCustomer: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        UserTechnical: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        callStatus: true,
      }
    })

    return index
  }  
     
}