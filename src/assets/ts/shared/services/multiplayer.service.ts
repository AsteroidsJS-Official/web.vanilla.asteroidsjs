import { AbstractService, IOnAwake, Service } from '@asteroidsjs'

import { SocketService } from './socket.service'

import { GameService } from './game.service'
import { UserService } from './user.service'

import { IPlayer } from '../interfaces/player.interface'

import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Service responsible for the multiplayer connection and
 * management.
 */
@Service({
  services: [GameService, SocketService, UserService],
})
export class MultiplayerService extends AbstractService implements IOnAwake {
  private gameService: GameService

  private socketService: SocketService

  private userService: UserService

  /**
   * Property that keeps all players from the multiplayer lobby.
   */
  private _players = new BehaviorSubject<{ [id: string]: IPlayer }>({})

  /**
   * An observable that is triggered every time the players property
   * is updated.
   */
  public get players$(): Observable<{ [id: string]: IPlayer }> {
    return this._players.asObservable()
  }

  public get players(): { [id: string]: IPlayer } {
    return this._players.value
  }

  public set players(players: { [id: string]: IPlayer }) {
    this._players.next(players)
  }

  /**
   * Property that represents whether the lobby is opened.
   */
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

  /**
   * Gets a player according to its id.
   *
   * @param playerId The player id.
   * @returns The player that matches the given id.
   */
  getPlayerById(playerId: string): IPlayer {
    return this.players[playerId]
  }

  /**
   * Connects a player to the lobby.
   *
   * @param playerId The player id to be set.
   */
  connectMe(playerId?: string): void {
    this.gameService.isConnectedToRoom = true
    const player = this.userService.player

    if (playerId) {
      player.id = playerId
    }

    player.score = 0
    this.socketService.emit('connect-player', player)
  }

  /**
   * Disconnects a player from the lobby.
   */
  disconnectMe(): void {
    this.gameService.isConnectedToRoom = false
    const player = this.userService.player

    this.socketService.emit('disconnect-player', player)
  }

  /**
   * Revives a player in the current lobby.
   *
   * @param playerId The player id whom will be revived.
   */
  respawn(playerId: string): void {
    this.socketService.emit('player-respawn', playerId)
  }

  /**
   * Listens for player connections in the current lobby.
   *
   * @returns An observable that triggers every time a player connects to the lobby.
   */
  listenConnections(): Observable<IPlayer> {
    return new Observable((subscriber) => {
      this.socketService.on<IPlayer>('player-connected').subscribe((player) => {
        const players = { ...this.players }
        players[player.id] = player
        this.players = players
        subscriber.next(player)
      })
    })
  }

  /**
   * Listens for player disconnections from the current lobby.
   *
   * @returns An observable that triggers every time a player disconnects from the lobby.
   */
  listenDisconnections(): Observable<IPlayer> {
    return new Observable((subscriber) => {
      this.socketService
        .on<IPlayer>('player-disconnected')
        .subscribe((player) => {
          const players = { ...this.players }
          delete players[player.id]
          this.players = players
          subscriber.next(player)
        })
    })
  }

  /**
   * Listens for player respawns in the current lobby.
   *
   * @returns An observable that triggers every time a player respawns in the lobby.
   */
  listenPlayerRespawns(): Observable<IPlayer> {
    return new Observable((subscriber) => {
      this.socketService.on<IPlayer>('player-respawn').subscribe((player) => {
        subscriber.next(player)
      })
    })
  }

  /**
   * Opens the local multiplayer lobby.
   */
  openLobby(): void {
    this.gameService.isInLocalMPGame = true
    this.socketService.emit('open-lobby')
  }

  /**
   * Closes the current local multiplayer lobby.
   */
  closeLobby(): void {
    this.gameService.isInLocalMPGame = false
    this.players = {}
    this.socketService.emit('close-lobby')
    this.socketService.emit('change-scene', 'menu')
  }

  /**
   * Increases a player score according to the given id and points.
   *
   * @param playerId The player id whom will receive the points.
   * @param points The amount of points to be added to the score.
   */
  increasePlayerScore(playerId: string, points: number): void {
    if (!this.players[playerId]) {
      return
    }

    const players = { ...this.players }
    players[playerId].score += points
    this.players = players
  }

  /**
   * Decreases a player score according to the given id and points.
   *
   * @param playerId The player id whom will lose the points.
   * @param points The amount of points to be removed from the score.
   */
  decreasePlayerScore(playerId: string, points: number): void {
    if (!this.players[playerId]) {
      return
    }

    const players = { ...this.players }
    const score = players[playerId].score
    players[playerId].score = score - points < 0 ? 0 : score - points
    this.players = players
  }
}
