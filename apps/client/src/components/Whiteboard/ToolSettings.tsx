import { useContext } from 'react'
import { ToolSettingsContext } from '../../context/ToolSettingsProvider'
import { IWhiteboard } from '../../types/whiteboard'
import { TSocketResponse, TWhiteboardElement } from '../../types/types'
import { SocketContext } from '../../context/SocketProvider'

function ToolSettings({
  whiteboard,
  setWhiteboard,
}: {
  whiteboard: IWhiteboard
  setWhiteboard: React.Dispatch<React.SetStateAction<IWhiteboard>>
}) {
  const toolSettings = useContext(ToolSettingsContext)

  const { socket } = useContext(SocketContext)!

  // TODO: Temporarily placed here. Should be moved in the future
  const createRect = () => {
    const newRect: TWhiteboardElement = {
      attrs: {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        fill: toolSettings.color,
      },
      className: 'Rect',
      isDragging: false,
      id: crypto.randomUUID(),
    }
    setWhiteboard((prev) => {
      return {
        ...prev,
        content: [...prev.content, newRect],
      }
    })
    socket.emit(
      'whiteboard:draw',
      whiteboard.id,
      newRect,
      (res: TSocketResponse) => {
        console.log('emmited draw order, received status:', res.status)
      }
    )
  }

  return (
    <section style={{ position: 'absolute', top: 40, left: 0 }}>
      <p>Tool</p>
      <select
        value={toolSettings.tool}
        onChange={(e) => {
          toolSettings.changeTool(e.target.value)
        }}
      >
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
      <select
        value={toolSettings.size}
        onChange={(e) => {
          toolSettings.changeSize(e.target.value)
        }}
      >
        <option value={2}>2</option>
        <option value={5}>5</option>
        <option value={8}>8</option>
        <option value={12}>12</option>
        <option value={16}>16</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <button onClick={createRect}>Rect</button>
      <input
        type="color"
        value={toolSettings.color}
        onChange={(e) => toolSettings.changeColor(e.target.value)}
      ></input>
    </section>
  )
}

export default ToolSettings
