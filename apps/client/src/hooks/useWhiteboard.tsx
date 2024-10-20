import { TSocketResponse } from '../types/types'
import { useSocketEvents } from './useSocketEvents'

export const useWhiteboard = () => {
  const { emitCreateWhiteboard, emitChangeVisibility } = useSocketEvents()
  const createWhiteboard = async (): Promise<TSocketResponse> => {
    return await emitCreateWhiteboard()
  }

  const changeWhiteboardVisibility = async (
    id: string,
    newVisibility: string
  ): Promise<TSocketResponse> => {
    return await emitChangeVisibility(id, newVisibility)
  }

  return { createWhiteboard, changeWhiteboardVisibility }
}
