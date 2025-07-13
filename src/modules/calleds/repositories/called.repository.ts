import { PrismaClient } from "@prisma/client";
import { type CreateCalledsSchemaType, IndexUserSchemaType } from "../schemas/called.schema"

export class CalledRepository {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async create(data: CreateCalledsSchemaType) {
    return await this.prisma.called.create({
      data: {
        fkUserCustomer: data.idCustomer,
        fkUserTechnical: data.idTechnical,
        titleCalled: data.titleCalled,
        description: data.description,
        services: {
          create: data.idServices.map(service => ({
            services: {
              connect: { id: service.id }
            }
          }))
        }
      },
      include: {
        services: true
      }
    })
  }

  async indexAll({ skip, take }: { skip: number, take: number, }) {
    return await this.prisma.called.findMany({
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
      },
      skip: skip,
      take: take
    })
  }

  async indexAllCout(){
    return await this.prisma.called.count()
  }

  async indexUserAll(data: { skip: number, take: number } & IndexUserSchemaType) {
    const userId = data.role === "customer" ? 
      { fkUserCustomer: data.id } : 
      { fkUserTechnical: data.id }

    return await this.prisma.called.findMany({
      where: userId,
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
      },
      skip: data.skip,
      take: data.take
    })
  }

  async indexUserCout(data: IndexUserSchemaType){
    const userId = data.role === "customer" ? 
      { fkUserCustomer: data.id } : 
      { fkUserTechnical: data.id }

    return await this.prisma.called.count({
      where: userId
    })
  }

}