import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from './ui/menubar'
import { Switch } from './ui/switch'

function WhiteboardOptions() {
  return (
    <Menubar className="absolute top-4 left-4 z-50">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Import</MenubarItem>
          <MenubarItem>Export</MenubarItem>
          <MenubarItem>Download</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Exit</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Visibility</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Public
            <MenubarShortcut>⌘V</MenubarShortcut>&nbsp;
            <Switch />
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Board</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Clear board <MenubarShortcut>⌘C</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export default WhiteboardOptions
