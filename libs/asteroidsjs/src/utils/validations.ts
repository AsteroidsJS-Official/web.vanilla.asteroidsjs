/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { AbstractEntity } from '../abstract-entity'

import { IOnDestroy } from '../interfaces'
import { IDraw } from '../interfaces/draw.interface'
import { IOnAwake } from '../interfaces/on-awake.interface'
import { IOnFixedLoop } from '../interfaces/on-fixed-loop.interface'
import { IOnLateLoop } from '../interfaces/on-late-loop.interface'
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
 * Function that validates if some object is of type {@link IOnLateLoop}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnLateLoop} interface, otherwise
 * false
 */
export function hasLateLoop(entity: any): entity is IOnLateLoop {
  return 'onLateLoop' in entity
}

/**
 * Function that validates if some object is of type {@link IOnFixedLoop}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnFixedLoop} interface, otherwise
 * false
 */
export function hasFixedLoop(entity: any): entity is IOnFixedLoop {
  return 'onFixedLoop' in entity
}

/**
 * Function that validates if some object is of type {@link IOnDestroy}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnDestroy} interface, otherwise
 * false
 */
export function hasDestroy(entity: any): entity is IOnDestroy {
  return 'onDestroy' in entity
}

/**
 * Function that validates if some object is of type {@link IOnDraw}
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
