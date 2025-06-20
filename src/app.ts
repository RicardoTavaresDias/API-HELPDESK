import express from "express"
import cors from "cors"
import { router } from "./routers"
import { ErrorHandling } from "./middlewares/ErrorHandling"

const app = express()
app.use(cors())
app.use(express.json())
app.use(router)
app.use(ErrorHandling)

export { app }