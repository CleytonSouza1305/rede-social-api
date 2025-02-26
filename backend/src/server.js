require('dotenv').config()

const express = require('express')
const authRouter = require('./routes/authroures')
const errorMiddeware = require('./middleware/error-middeware')
const postRouter = require('./routes/postRoutes')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
app.use('/auth', authRouter)
app.use(postRouter)

app.use(errorMiddeware)

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`Servidor iniciado em:\nhttp://localhost:${PORT}/feed`))