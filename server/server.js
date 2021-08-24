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
 * @property {number} number - The screen number.
 * @property {number} width - The screen width.
 * @property {number} height - The screen height.
 * @property {number} position - The screen position in the screens object.
 */

/**
 * @typedef {Object} Vector2
 * @property {object} position - The entity position;
 * @property {number} position.x - The entity x position;
 * @property {number} position.y - The entity y position;
 * @property {number} rotation - The entity rotation;
 * @property {object} dimensions - The entity dimensions;
 * @property {number} dimensions.width - The entity width;
 * @property {number} dimensions.height - The entity height;
 */

/**
 * The arguments passed by the command line.
 *
 * @type {string[]}
 */
const args = process.argv.slice(2)

/**
 * Represents the connected screens.
 *
 * @type {Object.<string, Screen>}
 */
let screens = {}

/**
 * The amount of screens that will be connected together. Default is 3.
 *
 * @type {number}
 */
let screenAmount =
  args.find((arg) => arg.includes('nscreens'))?.split('=')[1] ||
  process.env.SCREEN_AMOUNT ||
  3

/**
 * The amount of screens in each side of the master screen.
 *
 * @type {number}
 */
let screensBySide = Math.floor(screenAmount / 2)

/**
 * The screen socket for screen connections.
 *
 * @type {Server<import('socket.io-client/build/typed-events').DefaultEventsMap, import('socket.io-client/build/typed-events').DefaultEventsMap, import('socket.io-client/build/typed-events').DefaultEventsMap>}
 */
let ioScreen = null

/**
 * Function that starts the application, serving the main "index.html" and
 * making public the "dist" folder.
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
    const sKeys = Object.keys(screens).map((s) => +s)

    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    )

    if (sKeys.length === +screenAmount) {
      res.send('Screen limit reached!')
    } else {
      res.redirect(
        '/screen/' + (screens['1'] ? sKeys[sKeys.length - 1] + 1 : 1),
      )
      res.end()
    }
  })

  router.get('/screen/:screenNumber', (_, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    )

    if (Object.keys(screens).map((s) => +s).length === +screenAmount) {
      res.send('Screen limit reached!')
    } else {
      res.sendFile(path.resolve(__dirname, '../dist/index.html'))
    }
  })

  app.use('/', router)

  httpServer.listen(process.env.PORT || 8080)

  console.log('Listening on port ' + process.env.PORT || 8080)
  console.log('Expected display amount: ' + screenAmount)
}
setupServer()

/**
 * Method that setups the screen socket server for multiple screen connection.
 */
function setupSocketScreen() {
  ioScreen.on('connection', (socket) => {
    console.log('Connected: ' + socket.id)

    /**
     * Sets the new screen into screens object.
     *
     * @param {number} number - The screen number.
     * @param {number} width - The screen width.
     * @param {number} height - The screen height.
     * @param {(screen: Screen) => void} callback - A function to be called once the screen has been set.
     */
    function connectScreen({ number, width, height }, callback) {
      const screen = setScreen(socket.id, number, width, height)
      socket.join(screen.number === 1 ? 'master' : 'slave')
      callback(screen)
    }
    socket.on('connect-screen', connectScreen)

    /**
     * Sets the total screen amount.
     *
     * @param {number} amount - The amount of screens to be used in the game area.
     */
    function setScreenAmount(amount) {
      screenAmount = amount
      screensBySide = Math.floor(amount / 2)
    }
    socket.on('set-screen-amount', setScreenAmount)

    /**
     * Gets an object with the screens and the canvas total width and height.
     *
     * @param {(screens: Screen, canvasWidth: number, canvasHeight: number) => void} callback - The function that is going to be called at the end.
     */
    function getScreens(callback) {
      const screenKeys = Object.keys(screens).sort((s1, s2) => +s1 - +s2)

      const leftSide = [...screenKeys].slice(screensBySide + 1)
      const rightSide = [...screenKeys].slice(0, screensBySide + 1)

      ;[...leftSide, ...rightSide].forEach((screenNumber, index) => {
        screens[screenNumber].position = index
      })

      const canvasWidth = Object.values(screens)
        .map((s) => s.width)
        .reduce((previous, current) => previous + current)
      const canvasHeight = screens['1'].height

      callback({
        screens,
        canvasWidth,
        canvasHeight,
      })
    }
    socket.on('get-screens', getScreens)

    /**
     * Updates the positions of the entity in the slaves screens.
     *
     * @param {Vector2} vector - The master entity vector.
     */
    function updateSlaves(screenNumber, vector) {
      if (screenNumber === 1) {
        ioScreen.to('slave').emit('update-slave', vector)
      }
    }
    socket.on('update-slaves', updateSlaves)

    /**
     * Emits to all slaves screens that the game has started.
     */
    function startGame() {
      ioScreen.emit('start-game')
    }
    socket.on('start-game', startGame)
  })
}
setupSocketScreen()

/**
 * Method that setups the socket client for connecting the game with rooms
 * and allowing the multiplayer.
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
  screenN = screenN.toString()

  if (screens[screenN]) {
    screens[screenN].id = id
    return screens[screenN]
  }

  /**
   * @type {Screen}
   */
  const screen = { id, width, height, position: 0 }

  const numbers = Object.keys(screens).map((n) => parseInt(n))
  const newScreenN = numbers.length === 0 ? 1 : numbers[numbers.length - 1] + 1
  screen['number'] = newScreenN

  screens[newScreenN.toString()] = screen
  return screen
}
