import { useContext } from 'react'
import { ToolSettingsContext } from '../../context/ToolSettingsProvider'
import { IWhiteboard } from '../../types/whiteboard'
import { TSocketResponse, TWhiteboardElement } from '../../types/types'
import { SocketContext } from '../../context/SocketProvider'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Eraser, Pen, Square, Trash } from 'lucide-react'
import { Slider } from '../ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { HexColorInput, HexColorPicker } from 'react-colorful'

function ToolSettings({
  whiteboard,
  setWhiteboard,
  handleClearWhiteboard,
}: {
  whiteboard: IWhiteboard
  setWhiteboard: React.Dispatch<React.SetStateAction<IWhiteboard>>
  handleClearWhiteboard: () => void
}) {
  const toolSettings = useContext(ToolSettingsContext)

  const { socket } = useContext(SocketContext)!

  // TODO: Temporarily placed here. Should be moved in the future
  const createRect = () => {
    const newRect: TWhiteboardElement = {
      attrs: {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        fill: toolSettings.color,
      },
      className: 'Rect',
      isDragging: false,
      id: crypto.randomUUID(),
    }
    setWhiteboard((prev) => {
      return {
        ...prev,
        content: [...prev.content, newRect],
      }
    })
    socket.emit(
      'whiteboard:draw',
      whiteboard.id,
      newRect,
      (res: TSocketResponse) => {
        console.log('emmited draw order, received status:', res.status)
      }
    )
  }

  return (
    // <section style={{ position: 'absolute', top: 40, left: 0 }}>
    //   <button onClick={createRect}>Rect</button>
    //   <ColorPicker />
    // </section>
    <section
      id="tool-settings"
      className="absolute top-1/2 left-10 translate-y-[-50%] flex flex-row gap-2 z-50 transition-all"
    >
      <Card className="relative h-full">
        <CardHeader>
          <h2 className="text-base font-semibold">Tool</h2>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant={`${toolSettings.tool === 'pen' ? 'default' : 'ghost'}`}
            size="icon"
            onClick={() => toolSettings?.changeTool('pen')}
          >
            <Pen className="h-4 w-4" />
          </Button>
          <Button
            variant={`${toolSettings.tool === 'eraser' ? 'default' : 'ghost'}`}
            size="icon"
            onClick={() => toolSettings?.changeTool('eraser')}
          >
            <Eraser className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Square className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClearWhiteboard}>
            <Trash className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <Card id="tool-settings-properties" className="relative h-full">
        <CardHeader>
          <h2 className="text-base font-semibold">Properties</h2>
        </CardHeader>
        <CardContent className="grid gap-6">
          <article>
            <div className="flex flex-row justify-between items-baseline mb-3">
              <p className="text-sm text-muted-foreground">Size</p>
              <p className="text-slate-300 text-xs">{toolSettings.size}</p>
            </div>
            <Slider
              defaultValue={[5]}
              max={100}
              min={2}
              step={2}
              onValueChange={(e) => toolSettings.changeSize(e[0])}
              className="cursor-pointer w-44"
            />
          </article>
          <article>
            <div className="flex flex-row justify-between items-baseline mb-3">
              <p className="text-sm text-muted-foreground">Color</p>
              <HexColorInput
                color={toolSettings.color}
                onChange={(e) => toolSettings.changeColor(e)}
                className="text-end text-slate-300 text-xs"
              />
            </div>
            <Popover>
              <PopoverTrigger
                className="w-full h-8 rounded-md shadow-md cursor-pointer"
                style={{ backgroundColor: toolSettings.color }}
              ></PopoverTrigger>
              <PopoverContent>
                <HexColorPicker
                  color={toolSettings.color}
                  onChange={(e) => toolSettings.changeColor(e)}
                />
              </PopoverContent>
            </Popover>
          </article>
        </CardContent>
      </Card>
    </section>
  )
}

export default ToolSettings
