import { Rect } from 'react-konva'
import { TWhiteboardElement } from '../../types/types'
import { KonvaEventObject } from 'konva/lib/Node'

function RectRenderer({
  element,
  handleDragStart,
  handleDragEnd,
}: {
  element: TWhiteboardElement
  handleDragStart: (e: KonvaEventObject<MouseEvent>) => void
  handleDragEnd: (e: KonvaEventObject<MouseEvent>) => void
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
