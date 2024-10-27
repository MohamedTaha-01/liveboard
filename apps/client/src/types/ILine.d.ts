export interface ILine {
  attrs: {
    points: number[]
    stroke: string
    strokeWidth: number
    tension: number
    lineCap: string
    lineJoin: string
    globalCompositeOperation: string
  }
  className: string
}
