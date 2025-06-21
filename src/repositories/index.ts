import { PrismaClient } from "@prisma/client";
import { userRepository } from "./user.repository"; 

class Repository {
  prisma = new PrismaClient()
  user: userRepository;

  constructor(){
    this.user = new userRepository(this.prisma)
  }
}

export { Repository }