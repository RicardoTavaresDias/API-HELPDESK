import Repository from "@/repositories"
import { type CreateCalledsSchemaType, IndexUserSchemaType, UpdateStatusCalledSchemaType, idUpdateServicesSchemaType, idServicesType } from "../schemas/called.schema"
import type { InputCalled } from "../types/calleds-response"
import { pagination } from "@/libs/pagination"
import { refactorObjectData } from "../utils/refactor-object-data"
import { dayjs } from "@/libs/dayjs"
import { AppError } from "@/utils/AppError"

type DateCustomerType = {
  dateCustomer: string
}

type HourCustomerType = {
  hourCustomer: string
}

type DataType = {
  dateCustomer: string
  hourCustomer: string
}

class ServiceCalled {
  repository = new Repository()

  async createCalled (data: CreateCalledsSchemaType) {
    const resultTecnical = await this.showAvailableTechnician({ 
      dateCustomer: data.dateCustomer, hourCustomer: data.hourCustomer 
    })

    if(resultTecnical.length === 0){
      throw new AppError("Todos os técnicos já estão agendados nesse horário. Escolha outro horário ou dia.", 400)
    } 
  
    const refatureDataTecnical = resultTecnical.map(tecnical => ({ id: tecnical.id, name: tecnical.name }))

    const dataRefature = {
      idCustomer: data.idCustomer,
      idTecnical: refatureDataTecnical[0].id,
      dateCustomer: data.dateCustomer,
      hourCustomer: data.hourCustomer,
      titleCalled: data.titleCalled,
      description: data.description,
      idServices: data.idServices
    }

    await this.repository.called.create(dataRefature)
    return { nameTecnical: refatureDataTecnical[0].name }
  }

  async listCallsBySchedule ({ dateCustomer }: DateCustomerType) {
    const calledAll = await this.repository.called.indexAll({})
    // filtra o chamado na data especifica que o cliente selecionou a data de atendimento
    const calledDate = calledAll.filter(value => 
      dayjs(value.createdAt).format("DD/MM/YY") === 
      dayjs(dateCustomer).format("DD/MM/YY")
    )
   
    return calledDate
  }

  async checkTechnicianInService ({ dateCustomer, hourCustomer }: DataType) {
    const result = await this.listCallsBySchedule({ dateCustomer })
  
    // elimina o tecnico que esta no horario de atendimento
    const searchTecnicalInService = result.map(value => { 
      const hour = dayjs(value.createdAt).format("HH")
      if(hourCustomer.split(":")[0] === hour) return value.UserTechnical?.id
      return null
    })
  
    const removeNullResult = searchTecnicalInService.filter(value => value !== null)
    return removeNullResult
  }

  async checkAvailableTechnician ({ hourCustomer }: HourCustomerType) {
    // consulta tooos os tecnicos na lista userHours para ultilizar o id fkUserTechnical
    const hoursAllTecnical = await this.repository.user.indexAll({ role: "technical"})
    
    // seleciona todos do técnicos que esta disponivel para atedimento confome horario do cliente selecionou
    const tecnicalsAvailableInHours = 
      hoursAllTecnical.map(value => {
        const start = dayjs(value.userHours[0].startTime).format("HH:mm")
        const end = dayjs(value.userHours[0].endTime).format("HH:mm")
  
        if(dayjs(`2025-05-01T${hourCustomer}`).isSameOrAfter(`2025-05-01T${start}`) && 
            dayjs(`2025-05-01T${hourCustomer}`).isSameOrBefore(`2025-05-01T${end}`)
          ){
          return value
        } 
  
        return null
    }).filter(value => value !== null)

    return tecnicalsAvailableInHours
  }

  async showAvailableTechnician ({ dateCustomer, hourCustomer }: DataType) {
    const resultTechnicianInService = await this.checkTechnicianInService({ dateCustomer, hourCustomer })
    const resultAvailableTechnician = await this.checkAvailableTechnician({ hourCustomer }) 
   
    const tecnicalAvailable = resultAvailableTechnician.filter((value, index) => 
      value.id !== resultTechnicianInService[index])

    return tecnicalAvailable
  }

  async indexByCalled (id: number) {
    const resultDb =  await this.repository.called.indexAll({ id })

    const data = refactorObjectData(resultDb as InputCalled[] | [])
    return data
  }

  async indexAllCalled (data: { page: number, limit: number }) {
    const indexAllCout = await this.repository.called.indexAllCout()
    const resultPagination = pagination(data.page, indexAllCout, data.limit)
    const { skip, ...rest } = resultPagination

    const resultDb = await this.repository.called.indexAll({ skip: skip, take: data.limit })
    const resultMap = refactorObjectData(resultDb as InputCalled[] | [])

    return {
      result: rest,
      data: resultMap
    }
  }

  async indexUser (data: { page: number, limit: number } & IndexUserSchemaType) {
    const indexUserCout = await this.repository.called.indexUserCout({ id: data.id, role: data.role })
    const resultPagination = pagination(data.page, indexUserCout, data.limit)
    const { skip, ...rest } = resultPagination

    const resultDb =  await this.repository.called.indexUserAll({ skip: skip, take: data.limit, id: data.id, role: data.role })
    const resultMap = refactorObjectData(resultDb as InputCalled[] | [])

    return {
      result: rest,
      data: resultMap
    }
  }

  async updateStatus ({ id, status }: UpdateStatusCalledSchemaType) {
    return await this.repository.called.updateStatusCalled({ id, status })
  }

  async createServicesCalled (data: idUpdateServicesSchemaType) {
    return await this.repository.called.createServices(data)
  }

  async removeServicesCalled (data: idServicesType) {
    return await this.repository.called.removeServices(data)
  }
}

export { ServiceCalled }