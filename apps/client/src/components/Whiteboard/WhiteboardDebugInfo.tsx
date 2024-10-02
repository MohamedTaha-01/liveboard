import { IWhiteboard } from '@/types/whiteboard'

function WhiteboardDebugInfo({ whiteboard }: { whiteboard: IWhiteboard }) {
  return (
    <section
      style={{
        position: 'absolute',
        right: 0,
        top: 40,
        textAlign: 'right',
      }}
    >
      <p>ID: {whiteboard.id}</p>
      <p>Owner: {whiteboard.owner}</p>
      <p>Vis: {whiteboard.visibility}</p>
    </section>
  )
}

export default WhiteboardDebugInfo
