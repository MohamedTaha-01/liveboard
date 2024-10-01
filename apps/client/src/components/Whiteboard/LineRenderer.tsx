import { Line } from 'react-konva'
import { TWhiteboardElement } from '../../types/types'

function LineRenderer({ element }: { element: TWhiteboardElement }) {
  if (element.className !== 'Line') return null
  return (
    <Line
      points={element.attrs.points}
      stroke={element.attrs.stroke}
      strokeWidth={element.attrs.strokeWidth}
      tension={element.attrs.tension}
      lineCap={element.attrs.lineCap}
      lineJoin={element.attrs.lineJoin}
      globalCompositeOperation={
        element.attrs.globalCompositeOperation === 'destination-out'
          ? 'destination-out'
          : 'source-over'
      }
    />
  )
}

export default LineRenderer
