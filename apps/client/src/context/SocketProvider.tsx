import { s } from '@/socket'
import { createContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

enum EConnectionState {
  Disconnected = -1,
  Connecting = 0,
  Connected = 1,
}

export const SocketContext = createContext(undefined)

function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket>()
  const [connectionState, setConnectionState] = useState<EConnectionState>(0)

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
      setSocket(undefined)
      setConnectionState(EConnectionState.Disconnected)
    })

    return () => {
      s.off('connect', () => {
        setSocket(undefined)
        setConnectionState(EConnectionState.Disconnected)
      })
      s.off('connect_error', () =>
        setConnectionState(EConnectionState.Disconnected)
      )
      s.off('disconnect', () => {})
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
