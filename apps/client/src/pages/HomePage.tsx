import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WhiteboardContext } from '@/context/WhiteboardProvider'
import { useToast } from '@/hooks/use-toast'
import { useSocket } from '@/hooks/useSocket'
import { validateWhiteboardCode } from '@/lib/utils'
import { ChevronsDown } from 'lucide-react'
import { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TSocketResponse } from '../types/types'

function HomePage() {
  const { createWhiteboard } = useContext(WhiteboardContext)!
  const { errorToast } = useToast()
  const { emitWhiteboardCheck } = useSocket()
  const navigate = useNavigate()

  const wbCodeInputRef = useRef<HTMLInputElement>(null)

  const handleWhiteboardCreate = async () => {
    try {
      const res: TSocketResponse = await createWhiteboard()
      if (res.status !== 201) return errorToast(res.error)
      navigate(`/whiteboards/${res.whiteboard.id}`)
    } catch (err: unknown) {
      const error = err as Error
      return errorToast(error.message || (error as unknown as string))
    }
  }

  const handleWhiteboardJoin = async () => {
    const id = wbCodeInputRef.current?.value
    if (validateWhiteboardCode(id)) return errorToast('Invalid code')

    const res = await emitWhiteboardCheck(id as string)
    if (res.status !== 200) return errorToast(res.error)

    navigate(`/whiteboards/${wbCodeInputRef.current?.value}`)
  }

  return (
    <div
      className="snap-y snap-mandatory overflow-x-hidden overflow-y-scroll h-screen"
      style={{ scrollbarWidth: 'none' }}
    >
      <section className="relative snap-always snap-center bg-secondary-foreground">
        <div className="h-screen w-screen max-h-screen max-w-screen flex flex-col justify-center items-center overflow-hidden transition-all gap-4">
          <h1 className="text-6xl text-secondary uppercase tracking-wide font-semibold">
            <span className="text-primary">Live</span>Board
          </h1>
          <p className="text-3xl text-secondary">Draw, plan, collaborate.</p>
        </div>
        <ChevronsDown className="sticky bottom-2 left-1/2 -translate-x-1/2 text-secondary w-10 h-10" />
      </section>
      <section className="snap-always snap-center">
        <div className="h-screen w-screen max-h-screen max-w-screen flex flex-row overflow-hidden transition-all">
          <section className="p-10 w-3/6 bg-primary hover:w-5/6 transition-all flex flex-col justify-center items-center">
            <h2 className="h-2/3 text-5xl text-secondary uppercase tracking-wide font-semibold">
              Create
            </h2>
            <div className="flex flex-col justify-between items-center h-1/3">
              <h3 className="text-4xl text-secondary">
                Bring your ideas to life
              </h3>
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
                  onKeyDown={(e) => e.key === 'Enter' && handleWhiteboardJoin()}
                />
                <Button onClick={handleWhiteboardJoin}>Join whiteboard</Button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

export default HomePage
