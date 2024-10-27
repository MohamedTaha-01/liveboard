import useWhiteboard from '@/hooks/useWhiteboard'
import { useCallback, useRef } from 'react'
import { Stage, Layer } from 'react-konva'
import LineRenderer from './Renderers/LineRenderer'
import { KonvaEventObject } from 'konva/lib/Node'
import { TPosition } from '@/types/TPosition'
import useWindowSize from '@/hooks/useWindowSize'

function Whiteboard() {
  const { whiteboardContent, beginDraw, continueDraw } = useWhiteboard()
  const { windowSize } = useWindowSize()

  const isDrawing = useRef(false)
  const stageRef = useRef(null)

  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true
    const pos: TPosition = e.target
      .getStage()
      ?.getPointerPosition() as TPosition
    beginDraw(pos)
  }, [])

  const handleMouseMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) return
    const stage = e.target.getStage()
    const point = stage?.getPointerPosition() as TPosition
    continueDraw(point)
  }, [])

  const handleMouseUp = useCallback((e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = false
  }, [])

  return (
    <Stage
      listening={true}
      width={windowSize.width}
      height={windowSize.height}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      ref={stageRef}
      className="w-full h-full bg-background overflow-hidden"
    >
      <Layer>
        {whiteboardContent &&
          whiteboardContent.map((element, i) => (
            // <Fragment key={i}>
            <LineRenderer key={`line-${i}`} element={element} />
            /* <RectRenderer
                key={`rect-${i}`}
                element={element}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
              /> */
            /* </Fragment> */
          ))}
      </Layer>
    </Stage>
  )
}

export default Whiteboard
