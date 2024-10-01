import { useContext } from 'react'
import { SocketContext } from '../context/SocketProvider'
import { TSocketResponse } from '../types/types'

export const useSocket = () => {
  const { socket } = useContext(SocketContext)

  const _checkSocketConnection = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject('Socket not connected')
      } else {
        resolve()
      }
    })
  }

  const emitCreateWhiteboard = async (): Promise<TSocketResponse> => {
    await _checkSocketConnection()
    return await socket!.emitWithAck('whiteboard:create')
  }

  const emitJoinWhiteboard = async (id: string): Promise<TSocketResponse> => {
    await _checkSocketConnection()
    return await socket!.emitWithAck('whiteboard:join', id)
  }

  const emitChangeVisibility = async (
    id: string,
    visibility: string
  ): Promise<TSocketResponse> => {
    await _checkSocketConnection()
    return await socket!.emitWithAck(
      'whiteboard:change-visibility',
      id,
      visibility
    )
  }

  return { emitCreateWhiteboard, emitJoinWhiteboard, emitChangeVisibility }
}
