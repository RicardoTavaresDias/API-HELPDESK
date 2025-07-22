import { PrismaClient } from "@prisma/client";
import { type CreateCalledsSchemaType, IndexUserSchemaType, UpdateStatusCalledSchemaType, idUpdateServicesSchemaType, idServicesType } from "../schemas/called.schema"

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

  async indexAll({ skip, take, id }: { skip?: number, take?: number, id?: number}) {
    return await this.prisma.called.findMany({
      where: {
        id: id
      },
      select: {
        updatedAt: true,
        id: true,
        titleCalled: true,
        description: true,
        createdAt: true,
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
            email: true,
            avatar: true
          }
        },
        UserTechnical: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
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
        createdAt: true,
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
            avatar: true
          }
        },
        UserTechnical: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
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

  async updateStatusCalled(data: UpdateStatusCalledSchemaType){
    return await this.prisma.called.update({
      where: {
        id: data.id
      },
      data: {
        callStatus: data.status
      }
    })
  }

  async createServices(data: idUpdateServicesSchemaType){
    return await this.prisma.called.update({
      where: {
        id: data.idCalled
      },
      data: {
        services: {
          create: {
            services: {
              connect: { id: data.idServices }
            }
          }
        }
      },
      include: {
        services: {
          select: {
            services: true,
          }
        }
      }
    })
  }

  async removeServices(data: idServicesType){
    return await this.prisma.called.update({
      where: {
        id: data.idCalled
      },
      data: {
        services: {
          deleteMany: {
            fkServices: data.idServices
          }
        }
      }
    })
  }
}