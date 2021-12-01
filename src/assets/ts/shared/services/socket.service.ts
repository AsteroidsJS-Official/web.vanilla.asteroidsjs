import { AbstractService, Service } from '@asteroidsjs'

import io from 'socket.io-client/dist/socket.io.js'

import { BehaviorSubject, Observable } from 'rxjs'

type SocketEmitEvents =
  | 'cancel-connection'
  | 'change-health'
  | 'change-scene'
  | 'check-connection-waiting'
  | 'close-lobby'
  | 'connect-master-controller'
  | 'connect-player'
  | 'connect-screen'
  | 'destroy'
  | 'disconnect'
  | 'disconnect-player'
  | 'game-over'
  | 'get-game-status'
  | 'get-screens'
  | 'instantiate'
  | 'lobby-status'
  | 'master-controller-status'
  | 'open-lobby'
  | 'player-killed'
  | 'player-respawn'
  | 'set-screen-amount'
  | 'start-game'
  | 'update-actions'
  | 'update-player'
  | 'update-player-data'
  | 'update-slaves'
  | 'wait-for-slaves'

type SocketOnEvents =
  | 'cancel-connection'
  | 'change-health'
  | 'change-scene'
  | 'close-lobby'
  | 'destroy'
  | 'game-over'
  | 'get-game-status'
  | 'instantiate'
  | 'open-lobby'
  | 'player-connected'
  | 'player-disconnected'
  | 'player-killed'
  | 'player-respawn'
  | 'slave-connected'
  | 'slave-disconnected'
  | 'start-game'
  | 'update-actions'
  | 'update-game-players'
  | 'update-player'
  | 'update-screen'
  | 'waiting-connection'

/**
 * Service responsible by connecting to the liquid galaxy socket
 * and emit/receive socket envents.
 */
@Service()
export class SocketService extends AbstractService {
  /**
   * Property that defines the liquid galaxy socket.
   */
  public readonly socket = io(`https://api-socketio-asteroidsjs.herokuapp.com`)

  /**
   * Emits some data to the given event.
   *
   * @param event The event name to emit to.
   * @param data The data to send to the socket listener.
   * @returns An observable that listens to the socket emittion response.
   */
  emit<T = Record<string, unknown>, R = Record<string, unknown>>(
    event: SocketEmitEvents,
    data?: T,
  ): Observable<R> {
    const subject = new BehaviorSubject<R>(void 0)
    this.socket.emit(event, data, (response: R) => {
      subject.next(response)
    })
    return subject.asObservable()
  }

  /**
   * Gets an observable that listens for the given event emittionq.
   *
   * @param event The event to listen to.
   * @returns An observable that listens to the event emittion.
   */
  on<T = Record<string, unknown>>(event: SocketOnEvents): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data: T) => {
        subscriber.next(data)
      })
    })
  }
}
