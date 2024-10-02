import { useLocation, useNavigate } from 'react-router-dom'
import Whiteboard from '../components/Whiteboard/Whiteboard'
import { SocketContext } from '../context/SocketProvider'
import { useContext, useEffect, useState } from 'react'
import { TSocketResponse } from '../types/types'
import ToolSettings from '../components/Whiteboard/ToolSettings'
import { IWhiteboard } from '../types/whiteboard'
import { useWhiteboard } from '../hooks/useWhiteboard'

function WhiteboardPage() {
  const { socket } = useContext(SocketContext)!
  const { joinWhiteboard, changeWhiteboardVisibility } = useWhiteboard()
  const location = useLocation()
  const navigate = useNavigate()

  const [whiteboard, setWhiteboard] = useState<IWhiteboard>({
    id: undefined,
    owner: undefined,
    content: [],
    visibility: 'private',
  })

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

  const handleChangeVisibility = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newVisibility = e.target.value
    const oldVisibility = whiteboard.visibility
    if (newVisibility !== 'private' && newVisibility !== 'public') return
    if (newVisibility === oldVisibility) return

    setWhiteboard((prev) => {
      return { ...prev, visibility: newVisibility }
    })

    const res = await changeWhiteboardVisibility(whiteboard.id, newVisibility)

    if (res.status !== 200) {
      return setWhiteboard((prev) => {
        return { ...prev, visibility: oldVisibility }
      })
    }
    setWhiteboard((prev) => {
      return { ...prev, visibility: newVisibility }
    })
  }

  useEffect(() => {
    if (!socket) {
      setWhiteboard({
        id: undefined,
        owner: undefined,
        content: [],
        visibility: 'private',
      })
      return
    }
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
  }, [socket])

  return (
    (socket && (
      <>
        <Whiteboard whiteboard={whiteboard} setWhiteboard={setWhiteboard} />
        <section style={{ position: 'absolute', top: 0, left: 0 }}>
          <p>Visibility</p>
          <select
            value={whiteboard.visibility}
            onChange={handleChangeVisibility}
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </section>
        <ToolSettings whiteboard={whiteboard} setWhiteboard={setWhiteboard} />
        <section
          style={{
            position: 'absolute',
            right: 0,
            top: 40,
            textAlign: 'right',
          }}
        >
          <p>ID: {whiteboard.id}</p>
          <p>Owner: {whiteboard.owner}</p>
          <p>Vis: {whiteboard.visibility}</p>
        </section>
      </>
    )) || <p>Not connected</p>
  )
}

export default WhiteboardPage
