import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import data from "./data"
import notFoundRouter from "./routes/notFoundRouter"

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

mongoose.Promise = global.Promise
mongoose.connect(data.connectServerDb, null, () => console.log("connected to db"))

notFoundRouter(app)

app.listen(data.port, () => console.log(`server is Now Running on Port ${data.port}`))