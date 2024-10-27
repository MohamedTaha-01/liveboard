import Whiteboard from '@/components/Whiteboard/Whiteboard'
import WhiteboardOptions from '@/components/Whiteboard/WhiteboardOptions'
import WhiteboardTools from '@/components/Whiteboard/WhiteboardTools'

function WhiteboardPage() {
  return (
    <div className="w-screen h-screen">
      <WhiteboardOptions />
      <WhiteboardTools />
      <Whiteboard />
    </div>
  )
}

export default WhiteboardPage
