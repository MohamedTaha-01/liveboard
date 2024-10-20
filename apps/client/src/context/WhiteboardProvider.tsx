import { IWhiteboard, IWhiteboardContext } from '@/types/whiteboard'
import { createContext, useContext, useState } from 'react'
import { SocketContext } from './SocketProvider'

export const WhiteboardContext = createContext<IWhiteboardContext | undefined>(
  undefined
)

function WhiteboardProvider({ children }: { children: React.ReactNode }) {
  const [whiteboard, setWhiteboard] = useState<IWhiteboard>({
    id: undefined,
    owner: undefined,
    content: [],
    visibility: 'private',
  })

  const { socket } = useContext(SocketContext)!

  const clearWhiteboard = async () => {
    const res = await socket?.emitWithAck('whiteboard:clear', whiteboard.id)
    if (res.status !== 200) throw new Error(res.error)
    setWhiteboard((prev) => {
      return { ...prev, content: [] }
    })
  }

  return (
    <WhiteboardContext.Provider
      value={{ whiteboard, setWhiteboard, clearWhiteboard }}
    >
      {children}
    </WhiteboardContext.Provider>
  )
}

export default WhiteboardProvider
