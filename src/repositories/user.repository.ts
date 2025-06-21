import { PrismaClient } from "@prisma/client";
import { UserCustomerType, UserTechnicalType } from "../services/user-service";

export class userRepository {
  prisma: PrismaClient;

  constructor(prisma: PrismaClient){
    this.prisma = prisma
  }

  // ok
  async isUser(user: string){
    return await this.prisma.user.findFirst({
      where: {
        email: user
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
 
  // ok
  async createCustomer(data: UserCustomerType){
    return await this.prisma.user.create({
      data: data
    })
  }

  //ok
  async createTechnical(data: UserTechnicalType){
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
}