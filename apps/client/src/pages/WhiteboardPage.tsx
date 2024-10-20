import { useLocation, useNavigate } from 'react-router-dom'
import Whiteboard from '../components/Whiteboard/Whiteboard'
import { SocketContext } from '../context/SocketProvider'
import { useContext, useEffect, useState } from 'react'
import ToolSettings from '../components/Whiteboard/ToolSettings'
import { EConnectionState } from '../enums/enums'
import OptionsBar from '@/components/Whiteboard/OptionsBar'
import MouseCircle from '@/components/Whiteboard/MouseCircle'
import { ToolSettingsContext } from '@/context/ToolSettingsProvider'
import WhiteboardDebugInfo from '@/components/Whiteboard/WhiteboardDebugInfo'
import { Button } from '@/components/ui/button'
import { ChevronRightIcon, X } from 'lucide-react'
import { TOAST_DURATION } from '@/libs/constants'
import { useToast } from '@/hooks/use-toast'
import { WhiteboardContext } from '@/context/WhiteboardProvider'

function WhiteboardPage() {
  const { socket, setSocket, connectionState, setConnectionState } =
    useContext(SocketContext)!
  const toolSettings = useContext(ToolSettingsContext)

  const location = useLocation()
  const navigate = useNavigate()

  const { errorToast, toast } = useToast()

  const { whiteboard, setWhiteboard, joinWhiteboard, clearWhiteboard } =
    useContext(WhiteboardContext)!
  const [showToolSettings, setShowToolSettings] = useState(false)
  const [hasShownToast, setHasShownToast] = useState(false)

  const handleJoinWhiteboard = () => {
    try {
      const whiteboardCode = location.pathname.split('/whiteboards/')[1]
      joinWhiteboard(whiteboardCode)
    } catch (error) {
      errorToast(error.message)
      navigate(`/`)
    }
  }

  const handleClearWhiteboard = () => {
    try {
      clearWhiteboard()
    } catch (error) {
      errorToast(error.message)
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
        errorToast('Trying to reconnect...', 'Connection lost')
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
        errorToast('Try again later.', 'Unable to reconnect')
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
        <Whiteboard />
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
