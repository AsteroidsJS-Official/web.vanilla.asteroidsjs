const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const { io } = require('socket.io-client')

dotenv.config()

const socketApiUrl = process.env.SERVER_API_URL || 'http://localhost:3003'

const socket = io(socketApiUrl)

socket.on('connect', () => {
  console.log('Connected to server: ' + socket.id)
})

socket.on('disconnect', () => {
  console.log('Disconnected from server: ' + socket.id)
})

const app = express()
const router = express.Router()

app.use(express.static(path.resolve(__dirname, './dist')))

router.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

app.use('/', router)

app.listen(process.env.PORT || 8080)
