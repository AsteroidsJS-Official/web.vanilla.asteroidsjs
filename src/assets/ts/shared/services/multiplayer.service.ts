import { AbstractService, IOnAwake, Service } from '@asteroidsjs'

import { SocketService } from './socket.service'

import { GameService } from './game.service'
import { UserService } from './user.service'

import { IPlayer } from '../interfaces/player.interface'

import { Observable } from 'rxjs'

@Service({
  services: [GameService, SocketService, UserService],
})
export class MultiplayerService extends AbstractService implements IOnAwake {
  private gameService: GameService

  private socketService: SocketService

  private userService: UserService

  public players: { [id: string]: IPlayer } = {}

  public get lobbyStatus(): Observable<boolean> {
    return new Observable((subscriber) => {
      this.socketService
        .emit<unknown, boolean>('lobby-status')
        .subscribe((isLobbyOpen) => {
          subscriber.next(isLobbyOpen)
        })
    })
  }

  onAwake(): void {
    this.gameService = this.getService(GameService)
    this.socketService = this.getService(SocketService)
    this.userService = this.getService(UserService)
  }

  connectMe(playerId?: string): void {
    this.gameService.isConnectedToRoom = true
    const player = this.userService.player

    if (playerId) {
      player.id = playerId
    }

    this.socketService.emit('connect-player', player)
  }

  disconnectMe(): void {
    this.gameService.isConnectedToRoom = false
    const player = this.userService.player

    this.socketService.emit('disconnect-player', player)
  }

  respawn(playerId: string): void {
    this.socketService.emit('player-respawn', playerId)
  }

  listenConnections(): Observable<IPlayer> {
    return new Observable((subscriber) => {
      this.socketService.on<IPlayer>('player-connected').subscribe((player) => {
        this.players[player.id] = player
        subscriber.next(player)
      })
    })
  }

  listenDisconnections(): Observable<IPlayer> {
    return new Observable((subscriber) => {
      this.socketService
        .on<IPlayer>('player-disconnected')
        .subscribe((player) => {
          delete this.players[player.id]
          subscriber.next(player)
        })
    })
  }

  listenPlayerRespawns(): Observable<IPlayer> {
    return new Observable((subscriber) => {
      this.socketService.on<IPlayer>('player-respawn').subscribe((player) => {
        subscriber.next(player)
      })
    })
  }

  openLobby(): void {
    this.gameService.isInLocalMPGame = true
    this.socketService.emit('open-lobby')
  }

  closeLobby(): void {
    this.gameService.isInLocalMPGame = false
    this.players = {}
    this.socketService.emit('close-lobby')
    this.socketService.emit('change-scene', 'menu')
  }

  updatePlayer(player: IPlayer): void {
    this.players[player.id] = player
    this.socketService.emit('update-player-data', player)
  }

  listenPlayerUpdates<T = { [id: string]: IPlayer }>(): Observable<T> {
    return new Observable((subscriber) => {
      this.socketService.on<T>('update-game-players').subscribe((data) => {
        subscriber.next(data)
      })
    })
  }
}
