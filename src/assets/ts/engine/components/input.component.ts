import { IGameKeys } from '../../interfaces/input.interface';
import { Component } from '../core/component'
import { Vector2 } from '../core/vector2'
import { IStart } from '../interfaces/start.interface'
import { Rigidbody } from './rigidbody.component';
import { fromEvent } from 'rxjs';

export class Input extends Component implements IStart{
  private rigidbody: Rigidbody;
  private readonly force: number = 0.05;
  private gameKeys: IGameKeys = {};

  public start(): void {
    this.rigidbody = this.getComponent(Rigidbody);
    this.rigidbody.mass = 5;
    this.keyPressed();
  }

  /**
   * Captures the pressed key and checks the corresponding action
   */
  public keyPressed(): void{
    fromEvent(window, 'keydown').subscribe((e: KeyboardEvent) => {
      this.setGameKeyPressed(e.key, true);
      this.move();
    });

    fromEvent(window, 'keyup').subscribe((e: KeyboardEvent) => {
      this.setGameKeyPressed(e.key, false);
      this.move();
    });

  }

  /**
   * Function that realize the player moves
   * @param key string that represents the key pressed
   */
  private setGameKeyPressed(key: string, isPreseed: boolean): void {
    switch(key) {
      case "W":
      case "ArrowUp":
        this.gameKeys["up"] =  isPreseed;
        break;

      case "A":
      case "ArrowLeft":
        this.gameKeys["left"] =  isPreseed;
        break;

      case "S":
      case "ArrowDown":
        this.gameKeys["down"] =  isPreseed;
        break;

      case "D":
      case "ArrowRight":
        this.gameKeys["right"] =  isPreseed;
        break;
    }
  }

  /**
   *
   */
  private move(): void {
    if(!Object.entries(this.gameKeys).map((item) => item[1]).reduce((prev, cur) =>prev || cur)) {
      this.rigidbody.resultant = new Vector2();
      return;
    }
    for(const key in this.gameKeys){
      if(this.gameKeys[key] && key === "up"){
        this.rigidbody.resultant = Vector2.sum(this.rigidbody.resultant, new Vector2(0, this.force));
      }
      if(this.gameKeys[key] && key === "down"){
        this.rigidbody.resultant = Vector2.sum(this.rigidbody.resultant, new Vector2(0, -this.force));
      }
      if(this.gameKeys[key] && key === "right"){
        this.rigidbody.resultant = Vector2.sum(this.rigidbody.resultant, new Vector2(this.force, 0));
        console.log(this.rigidbody.resultant)
      }
      if(this.gameKeys[key] && key === "left"){
        this.rigidbody.resultant = Vector2.sum(this.rigidbody.resultant, new Vector2(-this.force, 0));
      }
    }
  }
}
