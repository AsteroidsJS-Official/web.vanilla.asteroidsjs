declare module 'socket.io-client/dist/socket.io.js' {
  import { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'
  import { DefaultEventsMap } from 'socket.io-client/build/typed-events'

  const io: (
    uri: string,
    opts?: Partial<ManagerOptions & SocketOptions>,
  ) => Socket<DefaultEventsMap, DefaultEventsMap>
  export default io
}
