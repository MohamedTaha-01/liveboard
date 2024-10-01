import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TSocketResponse } from '../types/types'
import { useWhiteboard } from '../hooks/useWhiteboard'

function HomePage() {
  const { createWhiteboard } = useWhiteboard()
  const navigate = useNavigate()

  const wbCodeInputRef = useRef<HTMLInputElement>(null)

  const handleWhiteboardCreate = async () => {
    try {
      const res: TSocketResponse = await createWhiteboard()
      if (res.status !== 201) return console.log(res.error)
      navigate(`/whiteboards/${res.whiteboard.id}`)
    } catch (err: unknown) {
      const error = err as Error
      console.log(error.message)
    }
  }

  const handleWhiteboardJoin = async () => {
    // TODO Validate input and if whiteboard exists
    navigate(`/whiteboards/${wbCodeInputRef.current?.value}`)
  }

  return (
    <section>
      <button onClick={handleWhiteboardCreate}>Create whiteboard</button>
      &nbsp;&nbsp;
      <input ref={wbCodeInputRef} type="text" placeholder="whiteboard code" />
      <button onClick={handleWhiteboardJoin}>Join whiteboard</button>
    </section>
  )
}

export default HomePage
