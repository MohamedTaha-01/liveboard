import { useLocation, useNavigate } from 'react-router-dom'
import Whiteboard from '../components/Whiteboard/Whiteboard'
import { SocketContext } from '../context/SocketProvider'
import { useContext, useEffect, useState } from 'react'
import { TSocketResponse } from '../types/types'
import ToolSettings from '../components/Whiteboard/ToolSettings'
import { IWhiteboard } from '../types/whiteboard'
import { useWhiteboard } from '../hooks/useWhiteboard'
import { EConnectionState } from '../enums/enums'
import OptionsBar from '@/components/Whiteboard/OptionsBar'
import MouseCircle from '@/components/Whiteboard/MouseCircle'
import { ToolSettingsContext } from '@/context/ToolSettingsProvider'
import WhiteboardDebugInfo from '@/components/Whiteboard/WhiteboardDebugInfo'
import { Button } from '@/components/ui/button'
import { ChevronRightIcon, X } from 'lucide-react'
import { TOAST_DURATION } from '@/libs/constants'
import { useToast } from '@/hooks/use-toast'

function WhiteboardPage() {
  const { socket, setSocket, connectionState, setConnectionState } =
    useContext(SocketContext)!
  const { joinWhiteboard } = useWhiteboard()
  const toolSettings = useContext(ToolSettingsContext)

  const location = useLocation()
  const navigate = useNavigate()

  const { toast } = useToast()

  const [whiteboard, setWhiteboard] = useState<IWhiteboard>({
    id: undefined,
    owner: undefined,
    content: [],
    visibility: 'private',
  })
  const [showToolSettings, setShowToolSettings] = useState(false)
  const [hasShownToast, setHasShownToast] = useState(false)

  const handleJoinWhiteboard = async () => {
    try {
      const whiteboardCode = location.pathname.split('/whiteboards/')[1]
      const res: TSocketResponse = await joinWhiteboard(whiteboardCode)
      switch (res.status) {
        case 200:
          setWhiteboard(res.whiteboard)
          break
        case 404:
          toast({
            title: 'Error',
            description: res.error,
            duration: TOAST_DURATION,
            variant: 'destructive',
          })
          navigate(`/`)
          break
        case 403:
          toast({
            title: 'Error',
            description: res.error,
            duration: TOAST_DURATION,
            variant: 'destructive',
          })
          navigate(`/`)
          break
        default:
          toast({
            title: 'Error',
            description: 'Oops! There was an error!',
            duration: TOAST_DURATION,
            variant: 'destructive',
          })
          navigate(`/`)
          break
      }
    } catch (err: unknown) {
      toast({
        title: 'Error',
        description: err as string,
        duration: TOAST_DURATION,
        variant: 'destructive',
      })
      navigate(`/`)
    }
  }

  const handleClearWhiteboard = async () => {
    try {
      const res = await socket?.emitWithAck('whiteboard:clear', whiteboard.id)
      if (res.status === 404) {
        return toast({
          title: 'Error',
          description: res.error,
          duration: TOAST_DURATION,
          variant: 'destructive',
        })
      }
      if (res.status !== 200) {
        return toast({
          title: 'Error',
          description: res.error,
          duration: TOAST_DURATION,
          variant: 'destructive',
        })
      }
      setWhiteboard((prev) => {
        return { ...prev, content: [] }
      })
    } catch (err: unknown) {
      const error = err as Error
      toast({
        title: 'Error',
        description: error.message || error,
        duration: TOAST_DURATION,
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (!socket || connectionState === EConnectionState.Disconnected) {
      setWhiteboard({
        id: undefined,
        owner: undefined,
        content: [],
        visibility: 'private',
      })
      if (!hasShownToast) {
        toast({
          title: 'Connection lost',
          description: 'Trying to reconnect...',
          duration: TOAST_DURATION,
          variant: 'destructive',
        })
        setHasShownToast(true)
      }
      return
    }

    if (connectionState === EConnectionState.Connected) {
      handleJoinWhiteboard()
      setHasShownToast(false)

      socket.on('whiteboard:change-visibility', (newVisibility) => {
        setWhiteboard((prev) => {
          return { ...prev, visibility: newVisibility }
        })
        if (socket.id === whiteboard.owner) return
        toast({
          title: 'You have been kicked from this whiteboard.',
          description: 'This whiteboard is now private.',
          duration: TOAST_DURATION,
          variant: 'default',
        })
        navigate('/')
      })

      socket.io.on('reconnect_failed', () => {
        toast({
          title: 'Unable to reconnect',
          description: 'Try again later.',
          duration: TOAST_DURATION,
          variant: 'destructive',
        })
        setConnectionState(EConnectionState.Disconnected)
        setSocket(undefined)
      })
      return () => {
        socket.off('whiteboard:change-visibility')
      }
    }
  }, [connectionState])

  return (
    (socket && (
      <div className="overflow-hidden">
        <Whiteboard whiteboard={whiteboard} setWhiteboard={setWhiteboard} />
        <OptionsBar
          whiteboard={whiteboard}
          setWhiteboard={setWhiteboard}
          handleClearWhiteboard={handleClearWhiteboard}
        />

        <Button
          onClick={() => setShowToolSettings((prev) => !prev)}
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 translate-y-[-50%] z-50"
        >
          {showToolSettings ? <X /> : <ChevronRightIcon />}
        </Button>
        {showToolSettings && (
          <ToolSettings
            whiteboard={whiteboard}
            setWhiteboard={setWhiteboard}
            handleClearWhiteboard={handleClearWhiteboard}
          />
        )}
        {/* <WhiteboardDebugInfo whiteboard={whiteboard} /> */}
        <MouseCircle color={toolSettings?.color} size={toolSettings?.size} />
      </div>
    )) || (
      <div className="flex justify-center items-center h-screen w-screen">
        {connectionState === EConnectionState.Disconnected && (
          <p>Disconnected</p>
        )}
        {connectionState === EConnectionState.Connecting && (
          <p>Connecting...</p>
        )}
      </div>
    )
  )
}

export default WhiteboardPage
