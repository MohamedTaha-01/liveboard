import Whiteboard from '@/components/Whiteboard'
import WhiteboardOptions from '@/components/WhiteboardOptions'
import WhiteboardTools from '@/components/WhiteboardTools'

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
