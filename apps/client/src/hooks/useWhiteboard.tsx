import { ILine } from '@/types/ILine'
import { TPosition } from '@/types/TPosition'
import { useState, useCallback, useRef } from 'react'

interface IWhiteboard {
  id: string | undefined
  owner: string | undefined
  visibility: 'private' | 'public'
}

function useWhiteboard() {
  const [whiteboardProperties, setWhiteboardProperties] = useState<IWhiteboard>(
    {
      id: undefined,
      owner: undefined,
      visibility: 'private',
    }
  )
  const [whiteboardContent, setWhiteboardContent] = useState<ILine[]>([])

  const lastUpdateRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const beginDraw = useCallback((pos: TPosition) => {
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
    setWhiteboardContent((prevContent) => [...prevContent, newLine])
  }, [])

  const continueDraw = useCallback((point: TPosition) => {
    if (Date.now() - lastUpdateRef.current < 16) return // throttle to ~60fps
    lastUpdateRef.current = Date.now()

    // Cancel any queued animation frame to avoid overlap
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    rafRef.current = requestAnimationFrame(() => {
      setWhiteboardContent((prevContent) => {
        const lastLine = { ...prevContent[prevContent.length - 1] }
        lastLine.attrs.points = lastLine.attrs.points.concat([point.x, point.y])
        return [...prevContent.slice(0, -1), lastLine]
      })
    })
  }, [])

  const endDraw = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  return {
    whiteboardProperties,
    whiteboardContent,
    beginDraw,
    continueDraw,
    endDraw,
  }
}

export default useWhiteboard
