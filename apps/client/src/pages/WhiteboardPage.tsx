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
import { ChevronRightIcon } from 'lucide-react'

function WhiteboardPage() {
  const { socket, connectionState } = useContext(SocketContext)!
  const { joinWhiteboard } = useWhiteboard()
  const toolSettings = useContext(ToolSettingsContext)

  const location = useLocation()
  const navigate = useNavigate()

  const [whiteboard, setWhiteboard] = useState<IWhiteboard>({
    id: undefined,
    owner: undefined,
    content: [],
    visibility: 'private',
  })
  const [showToolSettings, setShowToolSettings] = useState(false)

  const handleJoinWhiteboard = async () => {
    try {
      const whiteboardCode = location.pathname.split('/whiteboards/')[1]
      const res: TSocketResponse = await joinWhiteboard(whiteboardCode)
      switch (res.status) {
        case 200:
          setWhiteboard(res.whiteboard)
          break
        case 404:
          console.log('whiteboard not found')
          navigate(`/`)
          break
        case 403:
          console.log('not authorized')
          navigate(`/`)
          break
        default:
          navigate(`/`)
          break
      }
    } catch (err: unknown) {
      console.log(err)
      navigate(`/`)
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
      return
    }

    if (connectionState === EConnectionState.Connected) {
      handleJoinWhiteboard()

      socket.on('whiteboard:change-visibility', (newVisibility) => {
        setWhiteboard((prev) => {
          return { ...prev, visibility: newVisibility }
        })

        if (socket.id === whiteboard.owner) return
        console.log('You have been kicked from this whiteboard')
        navigate('/')
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
        <OptionsBar whiteboard={whiteboard} setWhiteboard={setWhiteboard} />

        <Button
          onClick={() => setShowToolSettings((prev) => !prev)}
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 translate-y-[-50%]"
        >
          <ChevronRightIcon />
        </Button>
        {showToolSettings && (
          <ToolSettings whiteboard={whiteboard} setWhiteboard={setWhiteboard} />
        )}
        {/* <WhiteboardDebugInfo whiteboard={whiteboard} /> */}
        <MouseCircle color={toolSettings?.color} size={toolSettings?.size} />
      </div>
    )) || <p>Connecting...</p>
  )
}

export default WhiteboardPage
