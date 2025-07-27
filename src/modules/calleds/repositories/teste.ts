import { dayjs } from "@/libs/dayjs"
import { PrismaClient } from "@prisma/client";

/*

[
  {
    fkUserTechnical: 'a957ad87-27ef-4e58-80b7-1e6cdfa24022',
    startTime: 2025-07-26T10:00:00.000Z,
    endTime: 2025-07-26T14:00:00.000Z,
    start: '07:00',
    end: '11:00'
  },
  {
    fkUserTechnical: 'e1e78f3f-e757-48d9-9ac7-2668b24c5d6e',
    startTime: 2025-07-26T11:00:00.000Z,
    endTime: 2025-07-26T14:00:00.000Z,
    start: '08:00',
    end: '11:00'
  },
  {
    fkUserTechnical: '91db647a-189e-4765-9dc1-8d0c7ab8349d',
    startTime: 2025-07-26T10:00:00.000Z,
    endTime: 2025-07-26T13:00:00.000Z,
    start: '07:00',
    end: '10:00'
  }
] [
  {
    id: 4,
    fkUserCustomer: 'f72c548e-103e-480e-97e1-e627a3ba335c',
    fkUserTechnical: 'a957ad87-27ef-4e58-80b7-1e6cdfa24022',
    titleCalled: 'Backup não está funcionando',
    description: 'O sistema de backup automático parou de funcionar. Última execução bem-sucedida foi há uma semana.',
    basePrice: 235,
    callStatus: 'in_progress',
    createdAt: 2025-07-24T16:11:20.344Z,
    updatedAt: 2025-07-25T18:42:53.308Z,
    creat: '13:11'
  },
  {
    id: 5,
    fkUserCustomer: 'f72c548e-103e-480e-97e1-e627a3ba335c',
    fkUserTechnical: 'a957ad87-27ef-4e58-80b7-1e6cdfa24022',
    titleCalled: 'Backup não está funcionando',
    description: 'O sistema de backup automático parou de funcionar. Última execução bem-sucedida foi há uma semana.',
    basePrice: 230,
    callStatus: 'open',
    createdAt: 2025-07-24T12:12:23.003Z,
    updatedAt: 2025-07-26T20:27:23.078Z,
    creat: '09:12'
  }
]

*/

/*
   A ideia é pegar todos os chamados que estão no horario que o cliente selecionou com a data do dia, 
 e fazer varredura quais tecnicos estão na quele horario de atendimento e remover da lista do disponivel, 
 os tecnicos que não estiverem no chamados ficara disponivel para atendimento mas verificar se o mesmo esta no horario de serviço para atendimento.
*/

// TESTE

// variaveis de entrada
const dataCliente = "2025-07-24T16:11:20.344Z" // pegar todos os chamados do dia que o cliente selecionou 
const horaDoCliente = "09:00"  // verifica os tecnicos disponivel nesse horario que o cliente selecionou

type DataCustomerType = {
  dataCliente: Date
}

type HoursCustomerType = {
  horaDoCliente: string
}

type Root = {
  dataCliente: any
  horaDoCliente: any
}


async function listCallsBySchedule ({ dataCliente }: DataCustomerType) {
  const prisma = new PrismaClient()
  // consulta todos os chamados 
  const testeCalled = await prisma.called.findMany()
  // filtra o chamado na data especifica que o cliente selecionou a data de atendimento
  const called = testeCalled.filter(value => 
    dayjs(value.createdAt).format("DD/MM/YY") === 
    dayjs(dataCliente).format("DD/MM/YY")
  )

  return called
}
  





async function checkTechnicianInService ({ dataCliente, horaDoCliente }: Root) {
  const called = await listCallsBySchedule({ dataCliente })

  // elimina o tecnico que esta no horario de atendimento
  const refature = called.map(value => { 
    const horario = dayjs(value.createdAt).format("HH")
    if(horaDoCliente.split(":")[0] === horario) return value.fkUserTechnical
    return null
    //return {...value, creat: dayjs(value.createdAt).format("HH:mm") }
  }).filter(value => value !== null)

  
  return refature
}






async function checkAvailableTechnician ({ horaDoCliente }: HoursCustomerType) {
  const prisma = new PrismaClient()

  // consulta tooos os tecnicos na lista userHours para ultilizar o id fkUserTechnical
  const teste = await prisma.userHours.findMany({
    select: {
      fkUserTechnical: true,
      startTime: true,
      endTime: true
    }
  })

  // seleciona todos do técnicos que esta disponivel para atedimento confome horario do cliente selecionou
  const tecnical = 
    teste.map(value => {
      const start = dayjs(value.startTime).format("HH:mm")
      const end = dayjs(value.endTime).format("HH:mm")

      if(dayjs(`2025-05-01T${horaDoCliente}`).isSameOrAfter(`2025-05-01T${start}`) && dayjs(`2025-05-01T${horaDoCliente}`).isSameOrBefore(`2025-05-01T${end}`)){
        return { ...value, start: dayjs(value.startTime).format("HH:mm"), end: dayjs(value.endTime).format("HH:mm") }
      } 

      return null
    }).filter(value => value !== null)

    return tecnical
}




async function showAvailableTechnician ({ dataCliente, horaDoCliente }: Root) {
  const resultTechnicianInService = await checkTechnicianInService({ dataCliente, horaDoCliente })
  const resultAvailableTechnician = await checkAvailableTechnician({ horaDoCliente }) 

  return [...resultAvailableTechnician.filter(value => value.fkUserTechnical !== resultTechnicianInService[0]), resultTechnicianInService]
}


// (async () => {
//   const result = await showAvailableTechnician({ dataCliente, horaDoCliente })
//   console.log(result)
// })()

export { showAvailableTechnician }