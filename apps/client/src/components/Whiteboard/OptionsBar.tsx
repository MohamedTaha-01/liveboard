import { useWhiteboard } from '@/hooks/useWhiteboard'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '../ui/menubar'
import { Switch } from '../ui/switch'
import { IWhiteboard } from '@/types/whiteboard'
import { useContext } from 'react'
import { SocketContext } from '@/context/SocketProvider'
import { TOAST_DURATION } from '@/libs/constants'
import { useToast } from '@/hooks/use-toast'

function OptionsBar({
  whiteboard,
  setWhiteboard,
}: {
  whiteboard: IWhiteboard
  setWhiteboard: React.Dispatch<React.SetStateAction<IWhiteboard>>
}) {
  const { socket } = useContext(SocketContext)

  const { toast } = useToast()

  const { changeWhiteboardVisibility } = useWhiteboard()

  const handleChangeVisibility = async () => {
    const oldVisibility = whiteboard.visibility
    const newVisibility =
      whiteboard.visibility === 'public' ? 'private' : 'public'

    setWhiteboard((prev) => {
      return { ...prev, visibility: newVisibility }
    })

    const res = await changeWhiteboardVisibility(whiteboard.id, newVisibility)

    if (res.status !== 200) {
      return setWhiteboard((prev) => {
        return { ...prev, visibility: oldVisibility }
      })
    }
    setWhiteboard((prev) => {
      return { ...prev, visibility: newVisibility }
    })
  }

  const handleClearWhiteboard = async () => {
    try {
      const res = await socket?.emitWithAck('whiteboard:clear', whiteboard.id)
      if (res.status === 404) {
        return toast({
          title: 'Error',
          description: res.error,
          duration: TOAST_DURATION,
          variant: 'destructive',
        })
      }
      if (res.status !== 200) {
        return toast({
          title: 'Error',
          description: res.error,
          duration: TOAST_DURATION,
          variant: 'destructive',
        })
      }
      setWhiteboard((prev) => {
        return { ...prev, content: [] }
      })
    } catch (err: unknown) {
      const error = err as Error
      toast({
        title: 'Error',
        description: error.message || error,
        duration: TOAST_DURATION,
        variant: 'destructive',
      })
    }
  }

  return (
    <Menubar className="absolute top-4 left-4 z-50">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Import</MenubarItem>
          <MenubarItem>Export</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Download</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Board</MenubarTrigger>
        <MenubarContent>
          {socket && socket.id === whiteboard.owner && (
            <>
              <MenubarItem
                onClick={(e) => {
                  e.preventDefault()
                  handleChangeVisibility()
                }}
              >
                Public
                <MenubarShortcut>⌘V</MenubarShortcut>&nbsp;
                <Switch
                  checked={whiteboard.visibility === 'public' ? true : false}
                />
              </MenubarItem>
              <MenubarSeparator />
            </>
          )}
          <MenubarItem onClick={handleClearWhiteboard}>
            Clear board <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default OptionsBar
