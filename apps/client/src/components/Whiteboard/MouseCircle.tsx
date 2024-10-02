import { useEffect, useState } from 'react'

type MouseCircleProps = {
  size?: number
  color?: string
}

export default function MouseCircle({
  size = 50,
  color = 'black',
}: MouseCircleProps) {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const handleMouseMove = (e: MouseEvent) => {
    setX(e.clientX)
    setY(e.clientY)
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        border: `2px solid ${color}`,
        borderRadius: '50%',
        pointerEvents: 'none',
      }}
    />
  )
}
