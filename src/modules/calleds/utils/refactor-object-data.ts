import { InputCalled } from "../types/calleds-response"

const refactorObjectData = (data: InputCalled[]) => {
  const result = data.map(called => {
    const priceTotal = called.services.reduce((acc, price) => acc + parseFloat(price.services.price.toString()), 0)
    const services = called.services.map(service => ({ id: service.services.id, titleService: service.services.titleService, price: service.services.price }))

    return {
      ...called,
      services,
      priceTotal
    }
  })

  return result
}

export { refactorObjectData }