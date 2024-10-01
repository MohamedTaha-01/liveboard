import { IWhiteboard } from './whiteboard'

export type TSocketResponse = {
  status: number
  message?: string
  error?: string
  [x: string]: IWhiteboard | never
}
export type TWhiteboardStage = {
  attrs: object
  className: string
  children: TWhiteboardLayer[]
}

export type TWhiteboardLayer = {
  attrs: object
  className: string
  children: TWhiteboardElement[]
}

export type TWhiteboardElement = {
  attrs: TWhiteboardLineAttrs | TWhiteboardRectAttrs
  className: string
  id?: string
}

export type TWhiteboardLineAttrs = {
  points: number[]
  stroke: string
  strokeWidth: number
  tension: number
  lineCap: 'butt' | 'round' | 'square'
  lineJoin: 'bevel' | 'miter' | 'round'
  globalCompositeOperation?: string
}

export type TWhiteboardRectAttrs = {
  x: number
  y: number
  width: number
  height: number
  fill: string
  draggable: boolean
}

export type TPosition = {
  x: number
  y: number
}
