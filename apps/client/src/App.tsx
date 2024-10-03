import DebugMenu from './components/DebugMenu/DebugMenu'
import Router from './components/Router/Router'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <main>
      <Router />
      <Toaster />
      {/* {import.meta.env.VITE_PROD && <DebugMenu />} */}
    </main>
  )
}

export default App
