import Repository from "@/repositories"
import { type CreateCalledsSchemaType, IndexUserSchemaType, UpdateStatusCalledSchemaType, idUpdateServicesSchemaType, idServicesType, CreateCalledCommentType, UpdateCalledCommentType } from "../schemas/called.schema"
import type { InputCalled, UpdateCommentCalledType } from "../types/calleds-response"
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
    // sorteio tecnico se tiver mais que um técnico disponivel
    const operatorDrawTechnician = Math.floor(Math.random() * (refatureDataTecnical.length - 0) + 0)

    const dataRefature = {
      idCustomer: data.idCustomer,
      idTecnical: refatureDataTecnical[operatorDrawTechnician].id,
      dateCustomer: data.dateCustomer,
      hourCustomer: data.hourCustomer,
      titleCalled: data.titleCalled,
      description: data.description,
      idServices: data.idServices
    }

    await this.repository.called.create(dataRefature)
    return { nameTecnical: refatureDataTecnical[operatorDrawTechnician].name }
  }

  async listCallsBySchedule ({ dateCustomer }: DateCustomerType) {
    const calledAll = await this.repository.called.indexAll({})
    // filtra todos os chamado na data especifica conforme o cliente agendou
    const calledDate = calledAll.filter(value => 
      dayjs(value.appointmentTime).tz("America/Sao_Paulo").format("DD/MM/YY") === 
      dayjs.tz(dateCustomer, "America/Sao_Paulo").format("DD/MM/YY")
    )
   
    return calledDate
  }

  async checkTechnicianInService ({ dateCustomer, hourCustomer }: DataType) {
    const result = await this.listCallsBySchedule({ dateCustomer })
  
    // elimina os tecnicos qeu já estão agendados em outros chamados
    const searchTecnicalInService = result.map(value => { 
      const hour = dayjs(value.appointmentTime).tz("America/Sao_Paulo").format("HH")
      if(hourCustomer.split(":")[0] === hour) return value.UserTechnical?.id
      return null
    })
  
    const removeNullResult = searchTecnicalInService.filter(value => value !== null)
    return removeNullResult
  }

  async checkAvailableTechnician ({ hourCustomer }: HourCustomerType) {
    // consulta todos os tecnicos no banco de dados.
    const hoursAllTecnical = await this.repository.user.indexAll({ role: "technical"})
    
    // seleciona todos os técnicos que esta disponivel para atedimento confome horario do cliente agendou
    const tecnicalsAvailableInHours = 
      hoursAllTecnical.filter(value => {
        return value.userHours.some(tech => {
          const start = dayjs(tech.startTime).tz("America/Sao_Paulo").format("HH:mm")
          const end = dayjs(tech.endTime).tz("America/Sao_Paulo").format("HH:mm")
          const hourClient = dayjs(`2025-05-01T${hourCustomer}`).tz("America/Sao_Paulo")

          return hourClient.isSameOrAfter(`2025-05-01T${start}`) && hourClient.isSameOrBefore(`2025-05-01T${end}`)
        })
    })
  
    return tecnicalsAvailableInHours
  }

  async showAvailableTechnician ({ dateCustomer, hourCustomer }: DataType) {
    const resultTechnicianInService = await this.checkTechnicianInService({ dateCustomer, hourCustomer })
    const resultAvailableTechnician = await this.checkAvailableTechnician({ hourCustomer }) 
   
    // remove os tecnicos que não estão disponivel
    const tecnicalAvailable = resultAvailableTechnician.filter(value => 
      !resultTechnicianInService.includes(value.id))

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

  async indexUser (data: { page: number, limit: number, status?: "open" | "close" | "in_progress" } & IndexUserSchemaType) {
    const indexUserCout = await this.repository.called.indexUserCout({ id: data.id, role: data.role })
    const resultPagination = pagination(data.page, indexUserCout, data.limit)
    const { skip, ...rest } = resultPagination

    const resultDb =  await this.repository.called.indexUserAll({ skip: skip, take: data.limit, id: data.id, role: data.role, status: data.status })
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
    const servicesExistCalled = await this.indexByCalled(data.idCalled)
    const [ called ] = servicesExistCalled
    const filterIdServices = called.services.map(service => service.id)

    if(filterIdServices.includes(data.idServices)) {
      throw new AppError("Item já cadastrado no chamado", 400)
    }
    
    return await this.repository.called.createServices(data)
  }

  async removeServicesCalled (data: idServicesType) {
    return await this.repository.called.removeServices(data)
  }

  async createComments (data: CreateCalledCommentType) {
    return await this.repository.called.createCommentsCalled(data)
  }

  async updateComments (data: UpdateCommentCalledType) {
    return await this.repository.called.updateCommentsCalled(data)
  }

  async removeComments (id: string) {
    return await this.repository.called.removeCommentsCalled(id)
  }
}

export { ServiceCalled }