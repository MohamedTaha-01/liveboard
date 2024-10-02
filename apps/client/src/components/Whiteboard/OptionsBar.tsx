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

function OptionsBar({
  whiteboard,
  setWhiteboard,
}: {
  whiteboard: IWhiteboard
  setWhiteboard: React.Dispatch<React.SetStateAction<IWhiteboard>>
}) {
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

  return (
    <Menubar className="absolute top-4 left-4 z-50">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Export</MenubarItem>
          <MenubarItem>Download</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Board</MenubarTrigger>
        <MenubarContent>
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

          <MenubarItem>
            Clear board <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default OptionsBar
