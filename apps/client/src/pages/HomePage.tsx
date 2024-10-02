import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TSocketResponse } from '../types/types'
import { useWhiteboard } from '../hooks/useWhiteboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
    <div className="h-screen w-screen max-h-screen max-w-screen flex flex-row overflow-hidden transition-all">
      <section className="p-10 w-3/6 bg-primary hover:w-5/6 transition-all flex flex-col justify-center items-center">
        <h2 className="h-2/3 text-5xl text-secondary uppercase tracking-wide font-semibold">
          Create
        </h2>
        <div className="flex flex-col justify-between items-center h-1/3">
          <h3 className="text-4xl text-secondary">Bring your ideas to life</h3>
          <Button
            onClick={handleWhiteboardCreate}
            variant="secondary"
            className="hover:bg-popover mt-4"
          >
            Create whiteboard
          </Button>
        </div>
      </section>
      <section className="p-10 w-3/6 bg-secondary hover:w-5/6 transition-all flex flex-col justify-center items-center">
        <h2 className="h-2/3 text-5xl text-primary uppercase tracking-wide font-semibold">
          Join
        </h2>
        <div className="flex flex-col justify-between items-center h-1/3">
          <h3 className="text-4xl text-primary w-10/12">
            Collaborate and share ideas in real time
          </h3>
          <div className="w-full flex flex-row items-center gap-4 mt-4">
            <Input
              ref={wbCodeInputRef}
              type="text"
              placeholder="Whiteboard code"
            />
            <Button onClick={handleWhiteboardJoin}>Join whiteboard</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
