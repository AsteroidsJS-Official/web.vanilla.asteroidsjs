const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const { io } = require('socket.io-client')

dotenv.config()

/**
 * Function that starts the application, serving the main "index.html" and
 * making public the "dist" folder
 */
function setupServer() {
  const app = express()
  const router = express.Router()

  app.use(express.static(path.resolve(__dirname, './dist')))

  router.get('/', (_, res) => {
    res.sendFile(path.resolve(__dirname, './dist/index.html'))
  })

  app.use('/', router)

  app.listen(process.env.PORT || 8080)
}
setupServer()

/**
 * Method that setups the socket client for connecting the game with rooms
 * and allowing the multiplayer
 */
function setupSocketClient() {
  const socket = io(process.env.SERVER_API_URL || 'http://localhost:3003')

  /**
   * Function that informs the user if the connection was successed
   */
  function connect() {
    console.log('Connected to server: ' + socket.id)
  }
  socket.on('connect', connect)

  /**
   * Function that informs the user if the connection was failed
   */
  function disconnect() {
    console.log('Connected to server: ' + socket.id)
  }
  socket.on('disconnect', disconnect)
}
setupSocketClient()
