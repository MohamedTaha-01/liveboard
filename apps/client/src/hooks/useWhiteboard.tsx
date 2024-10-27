import { ILine } from '@/types/ILine'
import { TPosition } from '@/types/TPosition'
import { useState } from 'react'

interface IWhiteboard {
  id: string | undefined
  owner: string | undefined
  content: Array<ILine>
  visibility: 'private' | 'public'
}

function useWhiteboard() {
  const [whiteboard, setWhiteboard] = useState<IWhiteboard>({
    id: undefined,
    owner: undefined,
    content: [],
    visibility: 'private',
  })

  const beginDraw = (pos: TPosition) => {
    const newLine: ILine = {
      attrs: {
        points: [pos.x, pos.y],
        stroke: '#ff0000',
        strokeWidth: 8,
        tension: 0.5,
        lineCap: 'round',
        lineJoin: 'round',
        globalCompositeOperation: 'pen',
      },
      className: 'Line',
    }

    setWhiteboard((prev) => {
      return {
        ...prev,
        content: [...prev.content, newLine],
      }
    })
  }

  const continueDraw = (point: TPosition) => {
    setWhiteboard((prev) => {
      const lastLine: ILine = prev.content.at(-1) as ILine
      // add point to last line
      lastLine.attrs.points = lastLine.attrs.points.concat([point.x, point.y])
      // replace last
      whiteboard.content.splice(whiteboard.content.length - 1, 1, lastLine)
      return { ...prev, content: [...prev.content.slice(0, -1), lastLine] }
    })
  }

  const endDraw = () => {}

  return { whiteboard, beginDraw, continueDraw, endDraw }
}

export default useWhiteboard
