import { PrismaClient } from "@prisma/client";
import { UserRepository } from "@/modules/users/repositories/user.repository"; 
import { ServicesRepository } from "@/modules/service-management/repositories/service-management.repository"

class Repository {
  prisma = new PrismaClient()
  user: UserRepository
  services: ServicesRepository

  constructor(){
    this.user = new UserRepository(this.prisma)
    this.services = new ServicesRepository(this.prisma)
  }
}

export default Repository 