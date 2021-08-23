const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { io: ioClient } = require('socket.io-client')

dotenv.config()

const masterUrl = process.env.MASTER_SCREEN_URL || 'http://localhost:8000'

/**
 * @typedef {Object} Screen
 * @property {string} id - The screen id.
 * @property {boolean} isConnected - Whether the screen is connected or not.
 * @property {number} number - The screen number.
 * @property {number} width - The screen width.
 * @property {number} height - The screen height.
 */

/**
 * The current screen id.
 *
 * @type {string|null}
 */
let screenId = null

/**
 * The current screen number.
 *
 * @type {number}
 */
let screenNumber = 1

/**
 * Represents the connected screens.
 *
 * @type {Object.<number, Screen>}
 */
const screens = {}

/**
 * The amount of screens that will be connected together. Default is 3.
 *
 * @type {number}
 */
let screenAmount = 3

let screenSocket

// let httpServer

// async function connectScreen(screen) {
//   screenSocket = ioClient(masterUrl)

//   const width = 600
//   const height = 300

//   return new Promise((resolve) => {
//     screenSocket.emit('connectScreen', screen, width, height, (response) => {
//       screenNumber = response.number
//       screenId = response.id
//       resolve(response)
//     })
//   })
// }

/**
 * Function that starts the application
 */
// function setupServer() {
//   const app = express()
//   httpServer = createServer(app)
//   setupSocketServer()

//   app.get('/', async (_, res) => {
//     if (screens.length === screenAmount) {
//       res.send('Screen limit reached!')
//     } else {
//       await connectScreen(null)
//       res.redirect('/screen/' + screenNumber)
//       res.end()
//     }
//   })

//   app.get('/screen/:screen', (req, res) => {
//     const _screenNumber = req.params.screen

//     /**
//      * @type {Screen}
//      */
//     const screen = screens[_screenNumber]

//     if (screen && screen.isConnected) {
//       res.send(screenNumber.toString())
//     } else if (screen) {
//       connectScreen(_screenNumber)
//       res.send(screenNumber.toString())
//     } else {
//       connectScreen(_screenNumber)
//       res.send(_screenNumber.toString())
//     }
//   })

//   httpServer.listen(+(process.env.SCREEN_PORT || 8000), () => {
//     console.log('Screen listening on port ' + process.env.SCREEN_PORT || 8000)
//   })
// }
// setupServer()

/**
 * Method that setups the socket for connecting the multiple screens
 */
function setupSocketServer() {
  const app = express()
  const httpServer = createServer(app)
  const io = new Server().listen(httpServer)

  setInterval(() => {
    io.emit('test', screens)
  }, 5000)

  io.on('getScreens', (callback) => {
    callback({ screens, screenAmount })
  })

  io.on('disconnect', () => {
    console.log('disconnected')
  })

  io.on('connection', (socket) => {
    console.log('Connected: ' + socket.id)

    socket.on('disconnect', () => {
      console.log('disc: ' + socket.id)
      const screen = Object.values(screens).find((s) => s.id === socket.id)

      if (screen) {
        screen.isConnected = false
      }
    })

    socket.on('connectScreen', (screenN, width, height, callback) => {
      const screen = setScreen(socket.id, screenN, width, height)
      callback(screen)
    })
  })

  httpServer.listen(+(process.env.SCREEN_PORT || 8000), () => {
    console.log('Screen listening on port ' + process.env.SCREEN_PORT || 8000)
  })
}
setupSocketServer()

/**
 * Sets the new screen to the screens object.
 *
 * @param {string} id - The screen socket id.
 * @param {number} screenN - The screen number.
 * @param {number} width - The screen width.
 * @param {number} height - The screen height.
 * @returns The connected screen data.
 */
function setScreen(id, screenN, width, height) {
  if (screens[screenN]) {
    screens[screenN].id = id
    screens[screenN].isConnected = true
    return screens[screenN]
  }

  /**
   * @type {Screen}
   */
  const screen = { id, width, height, isConnected: true }

  const numbers = Object.keys(screens).map((n) => parseInt(n))
  const newScreenN = numbers.length === 0 ? 1 : numbers[numbers.length - 1] + 1
  screen['number'] = newScreenN

  screens[newScreenN.toString()] = screen
  return screen
}
