require('dotenv').config()

const express = require('express')
const authRouter = require('./routes/authroures')
const errorMiddeware = require('./middleware/error-middeware')

const app = express()

app.use(express.json())
app.use('/auth', authRouter)

app.use(errorMiddeware)

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`Servidor iniciado em:\nhttp://localhost:${PORT}`))