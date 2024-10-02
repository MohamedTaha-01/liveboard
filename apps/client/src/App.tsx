import DebugMenu from './components/DebugMenu/DebugMenu'
import Router from './components/Router/Router'

function App() {
  return (
    <main>
      <Router />
      {/* {import.meta.env.VITE_PROD && <DebugMenu />} */}
    </main>
  )
}

export default App
