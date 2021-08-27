/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ICollider2 } from '../../interfaces/collider2.interface'
import { IOnAwake } from '../core/interfaces/on-awake.interface'
import { IOnDraw } from '../core/interfaces/on-draw.interface'
import { IOnLoop } from '../core/interfaces/on-loop.interface'
import { IOnStart } from '../core/interfaces/on-start.interface'

/**
 * Method that validates if some object is of type "ILoop"
 * @param entity defines an object that will be validated
 * @returns true if the object implements the "ILoop" interface, otherwise
 * false
 */
export function hasLoop(entity: any): entity is IOnLoop {
  return 'onLoop' in entity
}

/**
 * Method that validates if some object is of type "IAwake"
 * @param entity defines an object that will be validated
 * @returns true if the object implements the "IAwake" interface, otherwise
 * false
 */
export function hasAwake(entity: any): entity is IOnAwake {
  return 'onAwake' in entity
}

/**
 * Method that validates if some object is of type "IStart"
 * @param entity defines an object that will be validated
 * @returns true if the object implements the "IStart" interface, otherwise
 * false
 */
export function hasStart(entity: any): entity is IOnStart {
  return 'onStart' in entity
}

/**
 * Method that validates if some object is of type "IDraw"
 * @param entity defines an object that will be validated
 * @returns true if the object implements the "IDraw" interface, otherwise
 * false
 */
export function hasDraw(entity: any): entity is IOnDraw {
  return 'onDraw' in entity
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
    'onStartCollide' in entity &&
    'onStayCollide' in entity &&
    'onEndCollide' in entity
  )
}
