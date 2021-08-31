/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ICollider2 } from '../../interfaces/collider2.interface'
import { AbstractEntity } from '../abstract-entity'
import { IDraw } from '../interfaces/draw.interface'
import { IOnAwake } from '../interfaces/on-awake.interface'
import { IOnLoop } from '../interfaces/on-loop.interface'
import { IOnStart } from '../interfaces/on-start.interface'

/**
 * Function that validates if some object is of type {@link Entity}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object is of type, otherwise false
 */
export function isEntity(entity: any): entity is AbstractEntity {
  return 'components' in entity && 'game' in entity
}

/**
 * Function that validates if some object is of type {@link IOnLoop}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnLoop} interface, otherwise
 * false
 */
export function hasLoop(entity: any): entity is IOnLoop {
  return 'onLoop' in entity
}

/**
 * Function that validates if some object is of type {@link IOnAwake}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnAwake} interface, otherwise
 * false
 */
export function hasAwake(entity: any): entity is IOnAwake {
  return 'onAwake' in entity
}

/**
 * Function that validates if some object is of type {@link IOnStart}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnStart} interface, otherwise
 * false
 */
export function hasStart(entity: any): entity is IOnStart {
  return 'onStart' in entity
}

/**
 * Function that validates if some object is of type {@link IOnDraw}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnDraw} interface, otherwise
 * false
 */
export function hasDraw(entity: any): entity is IDraw {
  return 'draw' in entity
}

/**
 * Function that validates if some object is of type "ICollider"
 *
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

/**
 * Function that generates a new "uuid" string
 *
 * @returns the "uuid" value
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
