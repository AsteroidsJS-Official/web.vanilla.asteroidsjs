import express from 'express'
import { io } from 'socket.io-client'

import path from 'path'
import { config } from 'dotenv'

config()

const socketApiUrl: string =
  process.env.SOCKET_API_URL || 'http://localhost:3001'
const port = process.env.PORT || 8080

const app = express()

const socket = io(socketApiUrl)

app.use(express.static(path.resolve(__dirname + '../dist/assets')))

app.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname + '../dist/assets/html/index.html'))
})

socket.on('connect', () => {
  console.log('Connected to server: ' + socket.id)
})

socket.on('disconnect', () => {
  console.log('Disconnected from server: ' + socket.id)
})

app.listen(port)
