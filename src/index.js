import { io } from 'socket.io-client'

import { config } from 'dotenv'

config()

const socketApiUrl = process.env.SERVER_API_URL

const socket = io(socketApiUrl)

socket.on('connect', () => {
  console.log('Connected to server: ' + socket.id)
})

socket.on('disconnect', () => {
  console.log('Disconnected from server: ' + socket.id)
})
