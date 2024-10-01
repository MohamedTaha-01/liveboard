import { TSocketResponse } from '../types/types'
import { useSocket } from './useSocket'

export const useWhiteboard = () => {
  const { emitCreateWhiteboard, emitJoinWhiteboard } = useSocket()
  const createWhiteboard = async (): Promise<TSocketResponse> => {
    return await emitCreateWhiteboard()
  }

  const joinWhiteboard = async (id: string): Promise<TSocketResponse> => {
    if (!id) return Promise.reject('Missing whiteboard ID')
    return await emitJoinWhiteboard(id)
  }

  return { createWhiteboard, joinWhiteboard }
}
