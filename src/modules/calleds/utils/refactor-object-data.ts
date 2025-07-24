import { InputCalled } from "../types/calleds-response"

const refactorObjectData = (data: InputCalled[]) => {
  const result = data.map(called => {
    const priceTotal = called.services.reduce((acc, price) => acc + parseFloat(price.price.toString()), 0)
    const services = called.services.map(service => ({ id: service.fkServices, titleService: service.titleService, price: service.price }))

    return {
      ...called,
      services,
      priceTotal
    }
  })

  return result
}

export { refactorObjectData }