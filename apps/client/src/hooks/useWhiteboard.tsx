import { useState } from 'react'

interface IWhiteboard {
  id: string | undefined
  owner: string | undefined
  content: []
  visibility: 'private' | 'public'
}

function useWhiteboard() {
  const [whiteboard, setWhiteboard] = useState<IWhiteboard>({
    id: undefined,
    owner: undefined,
    content: [],
    visibility: 'private',
  })

  return { whiteboard, setWhiteboard }
}

export default useWhiteboard
