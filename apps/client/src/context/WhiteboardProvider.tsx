import { IWhiteboard, IWhiteboardContext } from '@/types/whiteboard'
import { createContext, useState } from 'react'

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

  return (
    <WhiteboardContext.Provider value={{ whiteboard, setWhiteboard }}>
      {children}
    </WhiteboardContext.Provider>
  )
}

export default WhiteboardProvider
