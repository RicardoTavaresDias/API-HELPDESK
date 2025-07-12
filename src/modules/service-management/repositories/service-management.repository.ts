import { PrismaClient } from "@prisma/client";
import type { ServicesSchema, StatusServicesEnum, UpdateSchemaType } from "../schemas/service-management.schema"

export class ServicesRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }

  async create({ title, price }: ServicesSchema){
    return await this.prisma.services.create({
      data: {
        titleService: title,
        price: price
      }
    })
  }

  async list({ skip, take, status }: { skip: number, take: number, status: StatusServicesEnum }){
    if(status){
      return await this.prisma.services.findMany({
        where: {
          serviceStatus: status
        },
        skip,
        take
      })
    }

    return await this.prisma.services.findMany({
      skip,
      take
    })
  }

  async existServices({ title }: { title?: string}){
    return await this.prisma.services.findMany({
      where: {
        titleService: title
      }
    })
  }

  async coutServices(){
    return await this.prisma.services.count()
  }

  async update({ id, data }: { id: string, data: UpdateSchemaType }){
    return await this.prisma.services.update({
      where: {
        id: id
      },
      data: {
        titleService: data.title,
        serviceStatus: data.status,
        price: data.price
      }
    })
  }

  async idUpdateExist(id: string) {
    return await this.prisma.services.findMany({
      where: {
        id: id
      }
    })
  }
}