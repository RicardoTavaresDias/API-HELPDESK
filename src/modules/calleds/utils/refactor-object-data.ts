import { InputCalled } from "../types/calleds-response"
import { basePrice } from "@/libs/basePrice"

const refactorObjectData = (data: InputCalled[]) => {
  const result = data.map(called => {
    const priceTotal = called.services.reduce((acc, price) => acc + parseFloat(price.services.price.toString()), 0)
    const services = called.services.map(service => ({ id: service.services.id, titleService: service.services.titleService, price: service.services.price }))

    return {
      ...called,
      services,
      priceTotal,
      basePrice
    }
  })

  return result
}

export { refactorObjectData }