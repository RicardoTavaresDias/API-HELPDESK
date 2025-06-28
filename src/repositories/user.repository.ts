import { PrismaClient } from "@prisma/client";
import { UserSchematype, TechnicalSchemaType } from "../schema/user.schema"
import type { UpdateUserType } from "../services/user-service"

export class UserRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }

  async isUser({ userEmail, id }: { userEmail?: string, id?: string }){
    return await this.prisma.user.findFirst({
      where: {
        email: userEmail && userEmail,
        id: id && id
      },
      include: {
        userHours: {
          select: {
            startTime: true,
            endTime: true
          }
        }
      }
    })
  }
 
  async createCustomer(data: UserSchematype){
    return await this.prisma.user.create({
      data: data
    })
  }

  async createTechnical(data: TechnicalSchemaType){
    return await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        userHours: {
          create: data.hours.map(hour => ({
            startTime: hour.startTime,
            endTime: hour.endTime
          }))
        }
      },
      include: {
        userHours: true
      }
    })
  }

  async indexAll({ skip, take, role }: { skip: number, take: number, role: "customer" | "technical"}){
    return await this.prisma.user.findMany({
      where: {
        role: role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        userHours: true
      },
      skip: skip,
      take: take,
      orderBy: {
        name: "desc"
      }
    })  
  }

  async coutUser(){
    return await this.prisma.user.count()
  }

  async update({ id, dataUpdate }: { id: string, dataUpdate: UpdateUserType}){
    const { hours, ...rest } = dataUpdate

    if(hours?.length){
      return await this.prisma.user.update({
        where: {
          id: id
        },
        data: {
          ...rest,
          userHours: {
            deleteMany: {},
            create: hours
          }
        }
      })
    }

    return await this.prisma.user.update({
      where: {
        id: id
      },
      data: dataUpdate
    })
  }

  async remove(id: string){
    const deleteUserHours = this.prisma.userHours.deleteMany({
      where: {
        fkUserTechnical: id
      }
    })

    const deleteUser = this.prisma.user.delete({
      where: {
        id: id
      }
    })

    return await this.prisma.$transaction([deleteUserHours, deleteUser])
  }
}