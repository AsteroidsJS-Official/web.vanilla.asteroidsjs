import { io } from 'socket.io-client'

const socketApiUrl: string =
  process.env.SOCKET_API_URL || 'http://localhost:3001'

const socket = io(socketApiUrl)

socket.on('connect', () => {
  console.log('Connected to server: ' + socket.id)
})

socket.on('disconnect', () => {
  console.log('Disconnected from server: ' + socket.id)
})
