import { PrismaClient } from "@prisma/client";
import { type CreateCalledsSchemaType, IndexUserSchemaType, UpdateStatusCalledSchemaType, idUpdateServicesSchemaType, idServicesType } from "../schemas/called.schema"
import { AppError } from "@/utils/AppError";
import { basePrice } from "@/libs/basePrice"

import { showAvailableTechnician } from "./teste"

export class CalledRepository {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async create(data: CreateCalledsSchemaType) {











    // variaveis de entrada
    const dataCliente = "2025-07-17T16:11:20.344Z" // pegar todos os chamados do dia que o cliente selecionou 
    const horaDoCliente = "24:00"  // verifica os tecnicos disponivel nesse horario que o cliente selecionou
    const teste = await showAvailableTechnician({ dataCliente, horaDoCliente })
    if(teste[0].length === 0) return console.log("Não tem Técnico disponivel na data de hoje, agendar para próximo dia.")
    return console.log(teste)











    const copyServices = await this.prisma.services.findMany({
      where: {
        id: {
          in: data.idServices.map(service => service.id)
        } 
      }
    })

    if (!copyServices.length) {
      throw new AppError("Alguns serviços não foram encontrados.", 400)
    }
    
    return await this.prisma.called.create({
      data: {
        fkUserCustomer: data.idCustomer,
        fkUserTechnical: data.idTechnical,
        titleCalled: data.titleCalled,
        description: data.description,
        basePrice: Number(basePrice.price),
        services: {
          create: copyServices.map(calledService => ({
            fkServices: calledService.id,
            titleService: calledService.titleService,
            price: calledService.price
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
        basePrice: true,
        services: {
          select: {
            fkServices: true,
            titleService: true,
            price: true
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
      where: userId ,
      select: {
        updatedAt: true,
        id: true,
        titleCalled: true,
        createdAt: true,
        basePrice: true,
        services: {
          select: {
            fkServices: true,
            titleService: true,
            price: true
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
    const newService = await this.prisma.services.findMany({
      where: {
        id: data.idServices
      }
    })

    if (!newService.length) {
      throw new AppError("Alguns serviços não foram encontrados.", 400)
    }

    return await this.prisma.called.update({
      where: {
        id: data.idCalled
      },
      data: {
        services: {
          create: newService.map(service => ({
            fkServices: service.id,
            titleService: service.titleService,
            price: service.price
          }))
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