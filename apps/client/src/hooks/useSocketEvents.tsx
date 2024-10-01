import { useContext } from 'react'
import { SocketContext } from '../context/SocketProvider'
import { TSocketResponse } from '../types/types'
import { TIMEOUT_DELAY } from '../libs/constants'

export const useSocketEvents = () => {
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
    try {
      return await socket!
        .timeout(TIMEOUT_DELAY)
        .emitWithAck('whiteboard:create')
    } catch (error) {
      return Promise.reject('Timeout error')
    }
  }

  const emitJoinWhiteboard = async (id: string): Promise<TSocketResponse> => {
    await _checkSocketConnection()
    try {
      return await socket!
        .timeout(TIMEOUT_DELAY)
        .emitWithAck('whiteboard:join', id)
    } catch (error) {
      return Promise.reject('Timeout error')
    }
  }

  const emitChangeVisibility = async (
    id: string,
    visibility: string
  ): Promise<TSocketResponse> => {
    await _checkSocketConnection()
    try {
      return await socket!
        .timeout(TIMEOUT_DELAY)
        .emitWithAck('whiteboard:change-visibility', id, visibility)
    } catch (error) {
      return Promise.reject('Timeout error')
    }
  }

  return { emitCreateWhiteboard, emitJoinWhiteboard, emitChangeVisibility }
}
