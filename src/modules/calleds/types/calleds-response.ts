type NestedService = {
  fkServices: string
  titleService: string
  price: number | string
}

export type InputCalled = {
  services: NestedService[]
  id: number
  titleCalled: string
  description: string 
  basePrice: number | string
  createdAt: Date
  updatedAt: Date
  UserCustomer: {
    id: number
    name: string
    email: string
    avatar: string
  }
  UserTechnical: {
    id: number
    name: string
    email: string
    avatar: string
  }
  callStatus: string
}