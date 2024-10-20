import { Toaster } from './components/ui/toaster'
import Router from './Router/Router'

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
