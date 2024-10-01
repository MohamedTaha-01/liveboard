import { createContext, ReactNode, useState } from 'react'
import { Socket } from 'socket.io-client'

type TSocketContext = {
  socket?: Socket
  setSocket: (socket: Socket | undefined) => void
}

export const SocketContext = createContext<TSocketContext>({
  setSocket: () => {
    throw new Error('Socket provider not found')
  },
})

function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>()

  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider
