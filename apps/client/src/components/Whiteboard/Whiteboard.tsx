import { Stage, Layer, Line, Rect } from 'react-konva'
import { KonvaEventObject } from 'konva/lib/Node'
import {
  TWhiteboardElement,
  TPosition,
  TSocketResponse,
} from '../../types/types'
import { Fragment, useContext, useRef } from 'react'
import { Stage as TStage } from 'konva/lib/Stage'
import { SocketContext } from '../../context/SocketProvider'
import { ToolSettingsContext } from '../../context/ToolSettingsProvider'
import { IWhiteboard } from '../../types/whiteboard'
import { TIMEOUT_DELAY } from '../../libs/constants'
import LineRenderer from './LineRenderer'
import RectRenderer from './RectRenderer'

function Whiteboard({
  whiteboard,
  setWhiteboard,
}: {
  whiteboard: IWhiteboard
  setWhiteboard: React.Dispatch<React.SetStateAction<IWhiteboard>>
}) {
  const { socket } = useContext(SocketContext)!

  const isDrawing = useRef(false)
  const stageRef = useRef<TStage>(null)

  const toolSettings = useContext(ToolSettingsContext)

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true
    const pos: TPosition = e.target
      .getStage()
      ?.getPointerPosition() as TPosition

    setWhiteboard((prev) => {
      return {
        ...prev,
        content: [
          ...whiteboard.content,
          {
            attrs: {
              points: [pos.x, pos.y],
              stroke: toolSettings.color,
              strokeWidth: parseInt(toolSettings.size),
              tension: 0.5,
              lineCap: 'round',
              lineJoin: 'round',
              globalCompositeOperation:
                toolSettings.tool === 'pen' ? 'source-over' : 'destination-out',
            },
            className: 'Line',
          },
        ],
      }
    })
  }

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) return

    const stage = e.target.getStage()
    const point = stage?.getPointerPosition() as TPosition
    const lastLine = whiteboard.content[whiteboard.content.length - 1]
    // add point
    lastLine.attrs.points = lastLine.attrs.points.concat([point.x, point.y])

    // replace last
    whiteboard.content.splice(whiteboard.content.length - 1, 1, lastLine)
    setWhiteboard((prev) => {
      return { ...prev, content: whiteboard.content.concat() }
    })
  }

  const handleMouseUp = async () => {
    isDrawing.current = false
    const lastLine = whiteboard.content[whiteboard.content.length - 1]
    try {
      const res: TSocketResponse = await socket
        .timeout(TIMEOUT_DELAY)
        .emitWithAck('whiteboard:draw', whiteboard.id, lastLine)
      console.log('emmited draw order, received status:', res.status)
    } catch (err) {
      const error: Error = err as Error
      console.log(error.message)
    }
  }

  const handleDragStart = (e: KonvaEventObject<MouseEvent>) => {
    const id = e.target.id()
    setWhiteboard((prev) => {
      return {
        ...prev,
        content: prev.content.map((el: TWhiteboardElement) => {
          return { ...el, isDragging: el.id === id }
        }),
      }
    })
  }
  const handleDragEnd = async (e: KonvaEventObject<MouseEvent>) => {
    const id = e.target.id()
    setWhiteboard((prev) => {
      return {
        ...prev,
        content: prev.content.map((el: TWhiteboardElement) => {
          return { ...el, isDragging: false }
        }),
      }
    })
    const movedElement = whiteboard.content.find((el) => el.id === id)

    try {
      const res: TSocketResponse = await socket
        .timeout(TIMEOUT_DELAY)
        .emitWithAck('whiteboard:move', whiteboard.id, movedElement)
      console.log('emmited move order, received status:', res.status)
    } catch (err) {
      const error: Error = err as Error
      console.log(error.message)
    }
  }

  socket.on('whiteboard:render', (newLine: TWhiteboardElement) => {
    console.log('received render order')
    setWhiteboard((prev) => {
      return { ...prev, content: [...prev.content, newLine] }
    })
  })

  return (
    <>
      {import.meta.env.VITE_PROD && (
        //! DEBUG // //
        <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 100 }}>
          <button onClick={() => console.log(stageRef.current?.toJSON())}>
            Stage to JSON
          </button>
        </div>
        //! // // // //
      )}

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          {whiteboard &&
            whiteboard.content &&
            whiteboard.content.map((element: TWhiteboardElement, i) => (
              <Fragment key={i}>
                <LineRenderer key={`line-${i}`} element={element} />
                <RectRenderer
                  key={`rect-${i}`}
                  element={element}
                  handleDragStart={handleDragStart}
                  handleDragEnd={handleDragEnd}
                />
              </Fragment>
            ))}
        </Layer>
      </Stage>
    </>
  )
}

export default Whiteboard
