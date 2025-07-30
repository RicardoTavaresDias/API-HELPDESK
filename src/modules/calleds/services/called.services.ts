import Repository from "@/repositories"
import { type CreateCalledsSchemaType, IndexUserSchemaType, UpdateStatusCalledSchemaType, idUpdateServicesSchemaType, idServicesType, CreateCalledCommentType, UpdateCalledCommentType } from "../schemas/called.schema"
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
    // filtra todos os chamado na data especifica conforme o cliente agendou
    const calledDate = calledAll.filter(value => 
      dayjs(value.appointmentTime).format("DD/MM/YY") === 
      dayjs(dateCustomer).format("DD/MM/YY")
    )
   
    return calledDate
  }

  async checkTechnicianInService ({ dateCustomer, hourCustomer }: DataType) {
    const result = await this.listCallsBySchedule({ dateCustomer })
  
    // elimina os tecnicos qeu já estão agendados em outros chamados
    const searchTecnicalInService = result.map(value => { 
      const hour = dayjs(value.appointmentTime).format("HH")
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
          const start = dayjs(tech.startTime).format("HH:mm")
          const end = dayjs(tech.endTime).format("HH:mm")

          return dayjs(`2025-05-01T${hourCustomer}`).isSameOrAfter(`2025-05-01T${start}`) && 
          dayjs(`2025-05-01T${hourCustomer}`).isSameOrBefore(`2025-05-01T${end}`)
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
    return await this.repository.called.createServices(data)
  }

  async removeServicesCalled (data: idServicesType) {
    return await this.repository.called.removeServices(data)
  }

  async createComments (data: CreateCalledCommentType) {
    return await this.repository.called.createCommentsCalled(data)
  }

  async updateComments (data: { description: string, id: string }) {
    return await this.repository.called.updateCommentsCalled(data)
  }

  async removeComments (id: string) {
    return await this.repository.called.removeCommentsCalled(id)
  }
}

export { ServiceCalled }