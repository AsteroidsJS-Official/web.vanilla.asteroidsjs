import io from 'socket.io-client/dist/socket.io.js'

export const socket = io(`${window.location.protocol}//${window.location.host}`)
