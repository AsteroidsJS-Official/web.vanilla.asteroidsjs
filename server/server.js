const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const { createServer } = require('http')
const { Server } = require('socket.io')
const { io } = require('socket.io-client')

dotenv.config()

/**
 * @typedef {Object} Screen
 * @property {string} id - The screen id.
 * @property {boolean} isConnected - Whether the screen is connected or not.
 * @property {number} number - The screen number.
 * @property {number} width - The screen width.
 * @property {number} height - The screen height.
 */

/**
 * Represents the connected screens.
 *
 * @type {Object.<number, Screen>}
 */
let screens = {}

/**
 * The amount of screens that will be connected together. Default is 3.
 *
 * @type {number}
 */
let screenAmount = 3

/**
 * @type {Server<import('socket.io-client/build/typed-events').DefaultEventsMap, import('socket.io-client/build/typed-events').DefaultEventsMap, import('socket.io-client/build/typed-events').DefaultEventsMap>}
 */
let ioScreen = null

/**
 * Function that starts the application, serving the main "index.html" and
 * making public the "dist" folder
 */
function setupServer() {
  const app = express()
  const httpServer = createServer(app)
  ioScreen = new Server().listen(httpServer)

  const router = express.Router()

  router.use(
    '/screen/:screenNumber',
    express.static(path.resolve(__dirname, '../dist')),
  )

  router.get('/', (_, res) => {
    const sKeys = Object.keys(screens).map((s) => parseInt(s))
    console.log(sKeys)

    if (sKeys.length === screenAmount) {
      res.send('Screen limit reached!')
    } else {
      res.redirect(
        '/screen/' + (screens['1'] ? sKeys[sKeys.length - 1] + 1 : 1),
      )
      res.end()
    }
  })

  router.get('/screen/:screenNumber', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'))
  })

  app.use('/', router)

  httpServer.listen(process.env.PORT || 8080)

  console.log('Listening on port ' + process.env.PORT || 8080)
}
setupServer()

function setupSocketScreen() {
  ioScreen.on('connection', (socket) => {
    console.log('Connected: ' + socket.id)

    socket.on('connectScreen', (location, callback) => {
      const screenN = location.split('/screen')[1].split('/')[0]
      const screen = setScreen(socket.id, screenN, 600, 400)
      callback(screen)
    })

    socket.emit('test-index', 'Hello from server')
  })
}
setupSocketScreen()

/**
 * Method that setups the socket client for connecting the game with rooms
 * and allowing the multiplayer
 */
function setupSocketClient() {
  const socket = io(process.env.SOCKET_URL || 'http://localhost:3001')

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
    return screens[screenN]
  }

  /**
   * @type {Screen}
   */
  const screen = { id, width, height }

  const numbers = Object.keys(screens).map((n) => parseInt(n))
  const newScreenN = numbers.length === 0 ? 1 : numbers[numbers.length - 1] + 1
  screen['number'] = newScreenN

  screens[newScreenN.toString()] = screen
  return screen
}

// async function connectScreen(screen) {
//   screenSocket = io(process.env.MASTER_SCREEN_URL || 'http://localhost:8000')

//   console.log(screenSocket.id)

//   /**
//    * Function that informs the user if the connection was successed
//    */
//   function connect() {
//     console.log('Connected: ' + screenSocket.id)
//   }
//   screenSocket.on('connect', connect)

//   /**
//    * Function that informs the user if the connection was failed
//    */
//   function disconnect() {
//     console.log('Connected to server: ' + screenSocket.id)
//   }
//   screenSocket.on('disconnect', disconnect)

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
