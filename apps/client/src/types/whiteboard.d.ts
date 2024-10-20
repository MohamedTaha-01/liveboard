import { TWhiteboardElement } from './types'

export interface IWhiteboard {
  id: string | undefined
  owner: string | undefined
  content: TWhiteboardElement[]
  visibility: 'public' | 'private'
}

export interface IWhiteboardContext {
  whiteboard: IWhiteboard
  setWhiteboard: React.Dispatch<React.SetStateAction<IWhiteboard>>
  joinWhiteboard: (id: string) => void
  clearWhiteboard: () => void
}

export interface IToolSettingsContext {
  tool: TWhiteboardTool
  size: number
  color: string
  changeTool: (t: TWhiteboardTool) => void
  changeSize: (s: number) => void
  changeColor: (c: string) => void
}

export type TWhiteboardTool = 'pen' | 'eraser'
