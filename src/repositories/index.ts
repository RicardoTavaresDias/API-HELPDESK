import { PrismaClient } from "@prisma/client";
import { UserRepository } from "./user.repository"; 
import { ServicesRepository } from "./services.repository"

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