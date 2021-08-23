/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ICollider2 } from '../interfaces/collider2.interface'
import { IDraw } from '../interfaces/draw.interface'
import { ILoop } from '../interfaces/loop.interface'
import { IStart } from '../interfaces/start.interface'

/**
 * Method that validates if some object is of type "ILoop"
 * @param entity defines an object that will be validated
 * @returns true if the object implements the "ILoop" interface, otherwise
 * false
 */
export function hasLoop(entity: any): entity is ILoop {
  return 'loop' in entity
}

/**
 * Method that validates if some object is of type "IStart"
 * @param entity defines an object that will be validated
 * @returns true if the object implements the "IStart" interface, otherwise
 * false
 */
export function hasStart(entity: any): entity is IStart {
  return 'start' in entity
}

/**
 * Method that validates if some object is of type "IDraw"
 * @param entity defines an object that will be validated
 * @returns true if the object implements the "IDraw" interface, otherwise
 * false
 */
export function hasDraw(entity: any): entity is IDraw {
  return 'draw' in entity
}

/**
 * Method that validates if some object is of type "ICollider"
 * @param entity defines an object that will be validated
 * @returns true if the object implements the "ICollider" interface,
 * otherwise
 * false
 */
export function hasCollider(entity: any): entity is ICollider2 {
  return (
    'startCollide' in entity &&
    'stayCollide' in entity &&
    'endCollide' in entity
  )
}
