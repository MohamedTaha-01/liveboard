import { IWhiteboard, IWhiteboardContext } from '@/types/whiteboard'
import { createContext, useContext, useState } from 'react'
import { SocketContext } from './SocketProvider'
import { TSocketResponse } from '@/types/types'
import { useSocketEvents } from '@/hooks/useSocketEvents'

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

  const { emitJoinWhiteboard } = useSocketEvents()

  const joinWhiteboard = async (id: string) => {
    if (!id) throw new Error('Missing whiteboard ID')
    const res: TSocketResponse = await emitJoinWhiteboard(id)
    if (res.status !== 200) throw new Error(res.error)
    setWhiteboard(res.whiteboard)
  }

  const clearWhiteboard = async () => {
    const res = await socket?.emitWithAck('whiteboard:clear', whiteboard.id)
    if (res.status !== 200) throw new Error(res.error)
    setWhiteboard((prev) => {
      return { ...prev, content: [] }
    })
  }

  return (
    <WhiteboardContext.Provider
      value={{ whiteboard, setWhiteboard, joinWhiteboard, clearWhiteboard }}
    >
      {children}
    </WhiteboardContext.Provider>
  )
}

export default WhiteboardProvider
