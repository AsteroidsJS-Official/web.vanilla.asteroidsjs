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
 * @property {boolean} isConnected - Whether the screen is connected or not.
 */

/**
 * @typedef {Object} Transform
 * @property {object} position - The entity position;
 * @property {number} position.x - The entity x position;
 * @property {number} position.y - The entity y position;
 * @property {number} rotation - The entity rotation;
 * @property {object} dimensions - The entity dimensions;
 * @property {number} dimensions.width - The entity width;
 * @property {number} dimensions.height - The entity height;
 */

/**
 * @typedef {Object} Player
 * @property {string} id - The player id.
 * @property {boolean} isMaster - Whether the player controls master screen.
 * @property {string} nickname - The player nickname.
 * @property {number} score - The player score.
 * @property {number} health - The player health.
 * @property {number} maxHealth - The player maximum health.
 * @property {Object} spaceship - The player spaceship info.
 * @property {string} color - The player spaceship color.
 * @property {string} colorName - The player spaceship color name.
 */

/**
 * @typedef {Object} SocketData
 * @property {string} id - The entity id;
 * @property {string} type - The entity type;
 * @property {number} data - The entity data;
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
 * Whether the master is waiting for slaves connection.
 */
let isWaitingForSlaves = false

/**
 * Whether the screen connection phase has finished.
 */
let isInGame = false

/**
 * Whether the master joystick controller is connected.
 *
 * @type {string | null}
 */
let masterController = null

/**
 * Whether the local multiplayer lobby is opened or not.
 */
let isLobbyOpened = false

/**
 * Property that keeps all players from a multiplayer game.
 *
 * @type {{ [id: string]: Player }}
 */
let players = {}

/**
 * Function that starts the application, serving the main "index.html" and
 * making public the "dist" folder.
 */
function setupServer() {
  const app = express()
  const httpServer = createServer(app)
  ioScreen = new Server().listen(httpServer)

  const router = express.Router()

  router.use('/', express.static(path.resolve(__dirname, '../dist')))

  router.use('/screen', express.static(path.resolve(__dirname, '../dist')))

  router.use(
    '/screen/:screenNumber',
    express.static(path.resolve(__dirname, '../dist')),
  )

  router.get('/', (_, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    )

    res.sendFile(path.resolve(__dirname, '../dist/index.html'))
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
      if (!screen) {
        callback(null)
        return
      }

      socket.join(screen.number === 1 ? 'master' : 'slave')
      callback(screen)

      if (screen.number !== 1) {
        ioScreen.to('master').emit('slave-connected', screen)
      }
    }
    socket.on('connect-screen', connectScreen)

    /**
     * Emits to all screens that master is waiting slaves connection.
     */
    function waitForSlaves() {
      isWaitingForSlaves = true
      ioScreen.emit('waiting-connection')
    }
    socket.on('wait-for-slaves', waitForSlaves)

    /**
     * Checks if master is waiting for slaves to connect.
     *
     * @param {(response: boolean) => void} callback A function that will send to emitter
     * whether master is waiting for slaves to connect.
     */
    function checkConnectionWaiting(_, callback) {
      callback(isWaitingForSlaves)
    }
    socket.on('check-connection-waiting', checkConnectionWaiting)

    function masterControllerStatus(_, callback) {
      callback(masterController)
    }
    socket.on('master-controller-status', masterControllerStatus)

    function connectMasterController(userId) {
      masterController = `${socket.id}|${userId}`
    }
    socket.on('connect-master-controller', connectMasterController)

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
     * Sets the 'isInGame' property to true.
     */
    function startGame() {
      isInGame = true
    }
    socket.on('start-game', startGame)

    /**
     * Gets the current game status.
     *
     * @param {(isInGame: boolean) => void} callback
     */
    function getGameStatus(_, callback) {
      callback(isInGame)
    }
    socket.on('get-game-status', getGameStatus)

    /**
     * Cancels the slave connection awaiting.
     */
    function cancelConnection() {
      screens = {
        1: screens['1'],
      }
      isWaitingForSlaves = false
      ioScreen.emit('cancel-connection')
    }
    socket.on('cancel-connection', cancelConnection)

    /**
     * Gets an object with the screens and the canvas total width and height.
     *
     * @param {(screens: {[key: string]: Screen}, canvasWidth: number, canvasHeight: number) => void} callback The function that is going to be called at the end.
     */
    function getScreens(_, callback) {
      const screenKeys = Object.keys(screens).sort((s1, s2) => +s1 - +s2)

      const leftSide = [...screenKeys].slice(screensBySide + 1)
      const rightSide = [...screenKeys].slice(0, screensBySide + 1)

      ;[...leftSide, ...rightSide].forEach((screenNumber, index) => {
        screens[screenNumber].position = index
      })

      callback({
        screens: Object.values(screens),
        screenAmount,
      })
    }
    socket.on('get-screens', getScreens)

    /**
     * Creates a new entity.
     *
     * @param {SocketData} data - The data used to create the new entity.
     */
    function onInstantiate(data) {
      ioScreen.to('slave').emit('instantiate', data)
    }
    socket.on('instantiate', onInstantiate)

    /**
     * Destroys an entity.
     *
     * @param {string} id - The entity id to be destroyed.
     */
    function onDestroy(id) {
      ioScreen.to('slave').emit('destroy', id)
    }
    socket.on('destroy', onDestroy)

    /**
     * Connects a player to the game.
     *
     * @param {Player} player The player data.
     */
    function connectPlayer(player) {
      players[socket.id] = player
      socket.join('local-mp')
      ioScreen.emit('player-connected', player)
    }
    socket.on('connect-player', connectPlayer)

    function disconnectPlayer(player) {
      if (player.isMaster) {
        players = {}
      } else {
        delete players[socket.id]
      }

      socket.leave('local-mp')
      ioScreen.emit('player-disconnected', player)
    }
    socket.on('disconnect-player', disconnectPlayer)

    function playerKilled(playerInfo) {
      ioScreen.emit('player-killed', playerInfo)
    }
    socket.on('player-killed', playerKilled)

    function playerRespawn(playerId) {
      const player = Object.values(players).find((p) => p.id === playerId)

      if (player) {
        ioScreen.emit('player-respawn', player)
      }
    }
    socket.on('player-respawn', playerRespawn)

    function updatePlayerData(player) {
      players[player.id] = player
    }
    socket.on('update-player-data', updatePlayerData)

    function openLobby() {
      isLobbyOpened = true
      ioScreen.emit('open-lobby')
    }
    socket.on('open-lobby', openLobby)

    function lobbyStatus(_, callback) {
      callback(isLobbyOpened)
    }
    socket.on('lobby-status', lobbyStatus)

    function closeLobby() {
      isLobbyOpened = false
      ioScreen.emit('close-lobby')
    }
    socket.on('close-lobby', closeLobby)

    /**
     * Updates the entity data in the slaves screens.
     *
     * @param {SocketData} data - The master entity vector.
     */
    function updateSlaves(data) {
      ioScreen.to('slave').emit('update-screen', data)
    }
    socket.on('update-slaves', updateSlaves)

    /**
     * Emits to all screens and controllers that the game is over.
     *
     * @param {Object} player The player that has died.
     */
    function gameOver(player) {
      ioScreen.emit('game-over', player)
    }
    socket.on('game-over', gameOver)

    /**
     * Emits to all slaves screens that the scene has changed.
     *
     * @param {string} scene The scene name.
     */
    function changeScene(scene) {
      ioScreen.emit('change-scene', scene)
    }
    socket.on('change-scene', changeScene)

    /**
     * Emits to all slaves screens that the entity have been damaged or healed.
     *
     * @param {{ id: string, health: number }} data The data containing the entity id and its health amount.
     */
    function changeHealth(data) {
      ioScreen.emit('change-health', data)
    }
    socket.on('change-health', changeHealth)

    /**
     * Emits to screens that the user has updated it's data from the mobile
     * controller.
     *
     * @param {string} data The player updated data.
     */
    function updatePlayer(data) {
      ioScreen.emit('update-player', data)
    }
    socket.on('update-player', updatePlayer)

    /**
     * Emits to  all screens that the user joystick actions were updated.
     *
     * @param {string} actions The joystick actions.
     */
    function updateActions(actions) {
      ioScreen.emit('update-actions', actions)
    }
    socket.on('update-actions', updateActions)

    /**
     * Called when a screen is disconnected.
     *
     * @param {string} reason - The reason for the disconnection.
     */
    function disconnect(reason) {
      const player = players[socket.id]

      if (player) {
        if (player.isMaster) {
          players = {}
        }

        socket.leave('local-mp')
        ioScreen.emit('player-disconnected', player)
        delete players[socket.id]
      }

      if (masterController && masterController.includes(socket.id)) {
        masterController = null
        return
      }

      const screen = Object.entries(screens).find(
        (entry) => entry[1].id === socket.id,
      )

      if (screen && screens[screen[0]]) {
        if (screen[0] === '1') {
          isWaitingForSlaves = false
        } else {
          ioScreen.to('master').emit('slave-disconnected', +screen['0'])
        }

        screens[screen[0]].isConnected = false
        console.log(`(${socket.id}) Screen disconnected: ${reason}`)
      }
    }
    socket.on('disconnect', disconnect)
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
    console.log('Disconnected to server: ' + socket.id)
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
  if (screenN) {
    screenN = screenN.toString()

    if (screens[screenN] && !screens[screenN].isConnected) {
      screens[screenN].id = id
      screens[screenN].isConnected = true
      return screens[screenN]
    }
  } else if (Object.keys(screens).length >= screenAmount) {
    return null
  }

  /**
   * @type {Screen}
   */
  const screen = {
    id,
    width: width || 0,
    height: height || 0,
    position: 0,
    isConnected: true,
  }

  const numbers = Object.keys(screens).map((n) => parseInt(n))
  const newScreenN = numbers.length === 0 ? 1 : numbers[numbers.length - 1] + 1
  screen['number'] = newScreenN

  screens[newScreenN.toString()] = screen
  return screen
}
