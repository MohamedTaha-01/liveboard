import { TSocketResponse } from '../types/types'
import { useSocketEvents } from './useSocketEvents'

export const useWhiteboard = () => {
  const { emitCreateWhiteboard, emitJoinWhiteboard, emitChangeVisibility } =
    useSocketEvents()
  const createWhiteboard = async (): Promise<TSocketResponse> => {
    return await emitCreateWhiteboard()
  }

  const joinWhiteboard = async (id: string): Promise<TSocketResponse> => {
    if (!id) return Promise.reject('Missing whiteboard ID')
    return await emitJoinWhiteboard(id)
  }

  const changeWhiteboardVisibility = async (
    id: string,
    newVisibility: string
  ): Promise<TSocketResponse> => {
    return await emitChangeVisibility(id, newVisibility)
  }

  return { createWhiteboard, joinWhiteboard, changeWhiteboardVisibility }
}
