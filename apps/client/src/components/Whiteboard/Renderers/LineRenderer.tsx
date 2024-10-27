import { ILine } from '@/types/ILine'
import { Line } from 'react-konva'

function LineRenderer({ element }: { element: ILine }) {
  if (element.className !== 'Line') return null
  return (
    <Line
      points={element.attrs.points}
      stroke={element.attrs.stroke}
      strokeWidth={element.attrs.strokeWidth}
      tension={element.attrs.tension}
      lineCap="round"
      lineJoin="round"
      globalCompositeOperation={
        element.attrs.globalCompositeOperation === 'destination-out'
          ? 'destination-out'
          : 'source-over'
      }
    />
  )
}

export default LineRenderer
