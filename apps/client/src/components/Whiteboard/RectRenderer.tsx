import { Rect } from 'react-konva'
import { TWhiteboardElement } from '../../types/types'

function RectRenderer({
  element,
  handleDragStart,
  handleDragEnd,
}: {
  element: TWhiteboardElement
  handleDragStart: Function
  handleDragEnd: Function
}) {
  if (element.className !== 'Rect') return null
  return (
    <Rect
      id={element.id}
      x={element.attrs.x}
      y={element.attrs.y}
      width={element.attrs.width}
      height={element.attrs.height}
      fill={element.attrs.fill}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      opacity={element.isDragging ? 0.7 : 1}
    />
  )
}

export default RectRenderer
