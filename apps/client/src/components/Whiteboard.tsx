import useWhiteboard from '@/hooks/useWhiteboard'
import { useRef } from 'react'
import { Stage, Layer } from 'react-konva'
import LineRenderer from './LineRenderer'

function Whiteboard() {
  const { whiteboard } = useWhiteboard()

  const stageRef = useRef(null)

  const handleMouseDown = (e) => {}

  const handleMouseMove = (e) => {}

  const handleMouseUp = (e) => {}

  return (
    <Stage
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      ref={stageRef}
      className="w-full h-full bg-background overflow-hidden"
    >
      <Layer>
        {whiteboard.content &&
          whiteboard.content.map((element, i) => (
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
