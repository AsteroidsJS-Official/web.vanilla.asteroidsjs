/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { AbstractEntity } from '../abstract-entity'

import { IOnDestroy } from '../interfaces'
import { IDraw } from '../interfaces/draw.interface'
import { IOnAwake } from '../interfaces/on-awake.interface'
import { IOnFixedLoop } from '../interfaces/on-fixed-loop.interface'
import { IOnLateLoop } from '../interfaces/on-late-loop.interface'
import { IOnLoop } from '../interfaces/on-loop.interface'
import { IOnRender } from '../interfaces/on-render.interface'
import { IOnStart } from '../interfaces/on-start.interface'

import { AbstractScene } from '../abstract-scene'

/**
 * Function that validates if some object is of type {@link Scene}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object is of type, otherwise false
 */
export function isScene(scene: any): scene is AbstractScene {
  return 'entities' in scene
}

/**
 * Function that validates if some object is of type {@link Entity}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object is of type, otherwise false
 */
export function isEntity(entity: any): entity is AbstractEntity {
  return 'components' in entity && 'scene' in entity
}

/**
 * Function that validates if some object is of type {@link IOnLoop}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnLoop} interface, otherwise
 * false
 */
export function hasOnLoop(entity: any): entity is IOnLoop {
  return 'onLoop' in entity
}

/**
 * Function that validates if some object is of type {@link IOnLateLoop}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnLateLoop} interface, otherwise
 * false
 */
export function hasOnLateLoop(entity: any): entity is IOnLateLoop {
  return 'onLateLoop' in entity
}

/**
 * Function that validates if some object is of type {@link IOnFixedLoop}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnFixedLoop} interface, otherwise
 * false
 */
export function hasOnFixedLoop(entity: any): entity is IOnFixedLoop {
  return 'onFixedLoop' in entity
}

/**
 * Function that validates if some object is of type {@link IOnDestroy}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnDestroy} interface, otherwise
 * false
 */
export function hasOnDestroy(entity: any): entity is IOnDestroy {
  return 'onDestroy' in entity
}

/**
 * Function that validates if some object is of type {@link IOnDraw}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnAwake} interface, otherwise
 * false
 */
export function hasOnAwake(entity: any): entity is IOnAwake {
  return 'onAwake' in entity
}

/**
 * Function that validates if some object is of type {@link IOnStart}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnStart} interface, otherwise
 * false
 */
export function hasOnStart(entity: any): entity is IOnStart {
  return 'onStart' in entity
}

/**
 * Function that validates if some object is of type {@link IOnRender}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IOnRender} interface, otherwise
 * false
 */
export function hasOnRender(entity: any): entity is IOnRender {
  return 'onRender' in entity
}

/**
 * Function that validates if some object is of type {@link IDraw}
 *
 * @param entity defines an object that will be validated
 * @returns true if the object implements the {@link IDraw} interface,
 * otherwise false
 */
export function hasDraw(entity: any): entity is IDraw {
  return 'draw' in entity
}
