import { PrismaClient } from "@prisma/client";
import { type IndexUserSchemaType, UpdateStatusCalledSchemaType, idUpdateServicesSchemaType, idServicesType, CreateCalledCommentType, UpdateCalledCommentType } from "../schemas/called.schema"
import { AppError } from "@/utils/AppError";
import { basePrice } from "@/libs/basePrice"
import dayjs from "dayjs";
import { UpdateCommentCalledType } from "../types/calleds-response";

type CreateCalledType = {
  idCustomer: string,
  idTecnical: string,
  dateCustomer: string,
  hourCustomer: string,
  titleCalled: string,
  description: string,
  idServices: ServiceType[]
}

type ServiceType = {
  id: string
}

export class CalledRepository {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async create(data: CreateCalledType) {
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
        fkUserTechnical: data.idTecnical,
        titleCalled: data.titleCalled,
        description: data.description,
        appointmentTime: dayjs.tz(`${data.dateCustomer}T${data.hourCustomer}`, "America/Sao_Paulo").toDate(),
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
        appointmentTime: true,
        services: {
          select: {
            fkServices: true,
            titleService: true,
            price: true
          }
        },
        calledComments: {
          select: {
            comment: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
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

  async indexUserAll(data: { skip: number, take: number, status?: "open" | "close" | "in_progress" } & IndexUserSchemaType) {
    const userId = data.role === "customer" ? 
      { fkUserCustomer: data.id } : 
      { fkUserTechnical: data.id }

    return await this.prisma.called.findMany({
      where: {
        ...userId,
        callStatus: data.status
      },
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
         calledComments: {
          select: {
            comment: true,
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
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
      take: data.take,      
    })
  }

  async indexUserCout(data: Omit<IndexUserSchemaType, 'status'>){
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

  async createCommentsCalled({ description, idUser, idCalled, type }: CreateCalledCommentType){
    return await this.prisma.comments.create({
      data: {
        description: description,
        type: type,
        calledComments: {
          create: {
            fkUser: idUser,
            fkCalled: idCalled
          }
        }
      },
      include: {
        calledComments: true
      }
    })
  }  

  async updateCommentsCalled({ description, commentid, userId, type }: UpdateCommentCalledType){
    return await this.prisma.comments.update({
      where: {
        id: commentid
      },
      data: { 
        description: description,
        type: type,
        calledComments: {
          updateMany: {
            where: {
              fkComments: commentid
            },
           data: {
            fkUser: userId
           }
        }
      }}
    })
  }  

  async removeCommentsCalled(id: string){
    return await this.prisma.comments.delete({
      where: {
        id: id
      }
    })
  }  
}