/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ICollider2 } from '../../interfaces/collider2.interface'
import { Entity } from '../core/entity'
import { IOnAwake } from '../core/interfaces/on-awake.interface'
import { IOnDraw } from '../core/interfaces/on-draw.interface'
import { IOnLoop } from '../core/interfaces/on-loop.interface'
import { IOnStart } from '../core/interfaces/on-start.interface'

/**
 * Method that validates if some object is of type {@link Entity}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object is of type, otherwise false
 */
export function isEntity(entity: any): entity is Entity {
  return 'components' in entity && 'game' in entity
}

/**
 * Method that validates if some object is of type {@link IOnLoop}
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnLoop} interface, otherwise
 * false
 */
export function hasLoop(entity: any): entity is IOnLoop {
  return 'onLoop' in entity
}

/**
 * Method that validates if some object is of type {@link IOnAwake}
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnAwake} interface, otherwise
 * false
 */
export function hasAwake(entity: any): entity is IOnAwake {
  return 'onAwake' in entity
}

/**
 * Method that validates if some object is of type {@link IOnStart}
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnStart} interface, otherwise
 * false
 */
export function hasStart(entity: any): entity is IOnStart {
  return 'onStart' in entity
}

/**
 * Method that validates if some object is of type {@link IOnDraw}
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnDraw} interface, otherwise
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
