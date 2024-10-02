import { createContext, ReactNode, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { EConnectionState } from '../enums/enums'
import { s } from '../socket'

type TSocketContext = {
  socket?: Socket
  connectionState: EConnectionState
  setSocket: (socket: Socket | undefined) => void
  setConnectionState: (state: EConnectionState) => void
}

export const SocketContext = createContext<TSocketContext>({
  setSocket: () => {
    throw new Error('Socket provider not found')
  },
  connectionState: EConnectionState.Connecting,
  setConnectionState: () => {
    throw new Error('Socket provider not found')
  },
})

function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>()
  const [connectionState, setConnectionState] = useState<EConnectionState>(
    EConnectionState.Connecting
  )

  useEffect(() => {
    s.on('connect', () => {
      console.log('connected with ID', s.id)
      setSocket(s)
      setConnectionState(EConnectionState.Connected)
    })
    s.on('connect_error', (_error) => {
      if (s.active) {
        console.log('connection error, reconnecting...')
        setConnectionState(EConnectionState.Connecting)
      } else {
        console.log('connection error, not reconnecting')
        setConnectionState(EConnectionState.Disconnected)
      }
    })
    s.on('disconnect', () => {
      console.log('disconnected')
      setSocket(undefined)
      setConnectionState(EConnectionState.Disconnected)
    })

    return () => {
      s.off('connect', () => {
        console.log('disconnected')
        setSocket(undefined)
        setConnectionState(EConnectionState.Disconnected)
      })
      s.off('connect_error', () => {
        console.log('disconnected')
        setConnectionState(EConnectionState.Disconnected)
      })
    }
  }, [socket])

  return (
    <SocketContext.Provider
      value={{ socket, setSocket, connectionState, setConnectionState }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
