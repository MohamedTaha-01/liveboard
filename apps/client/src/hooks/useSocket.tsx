import { useContext } from 'react'
import { SocketContext } from '../context/SocketProvider'
import { TSocketResponse } from '../types/types'
import { TIMEOUT_DELAY } from '../libs/constants'

export const useSocket = () => {
  const { socket } = useContext(SocketContext)

  const __checkSocketConnection = (): Promise<void> => {
    return new Promise((resolve, reject) =>
      socket
        ? resolve()
        : reject('Unable to establish connection with the server.')
    )
  }

  const emitCreateWhiteboard = async (): Promise<TSocketResponse> => {
    await __checkSocketConnection()
    try {
      return await socket!
        .timeout(TIMEOUT_DELAY)
        .emitWithAck('whiteboard:create')
    } catch (_error) {
      return Promise.reject('Timeout error')
    }
  }

  const emitJoinWhiteboard = async (id: string): Promise<TSocketResponse> => {
    await __checkSocketConnection()
    try {
      return await socket!
        .timeout(TIMEOUT_DELAY)
        .emitWithAck('whiteboard:join', id)
    } catch (_error) {
      return Promise.reject('Timeout error')
    }
  }

  const emitChangeVisibility = async (
    id: string,
    visibility: string
  ): Promise<TSocketResponse> => {
    await __checkSocketConnection()
    try {
      return await socket!
        .timeout(TIMEOUT_DELAY)
        .emitWithAck('whiteboard:change-visibility', id, visibility)
    } catch (_error) {
      return Promise.reject('Timeout error')
    }
  }

  const emitWhiteboardCheck = async (id: string): Promise<TSocketResponse> => {
    await __checkSocketConnection()
    try {
      return await socket!
        .timeout(TIMEOUT_DELAY)
        .emitWithAck('whiteboard:check', id)
    } catch (_error) {
      return Promise.reject('Timeout error')
    }
  }

  return {
    emitCreateWhiteboard,
    emitJoinWhiteboard,
    emitChangeVisibility,
    emitWhiteboardCheck,
  }
}
