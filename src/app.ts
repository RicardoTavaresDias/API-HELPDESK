import express from "express"
import cors from "cors"
import { router } from "./routers"
import { ErrorHandling } from "./middlewares/ErrorHandling"

import swaggerUi from "swagger-ui-express"
import swaggerDocument from "../swagger.json"

const app = express()

app.use(cors({
  origin: [ 
    'https://helpdesk-react-iota.vercel.app',
    'http://localhost:5173/'
  ]
}))

app.use(express.json())

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(router)
app.use(ErrorHandling)

export { app }