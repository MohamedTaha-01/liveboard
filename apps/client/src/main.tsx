import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import SocketProvider from './context/SocketProvider.tsx'
import { ToolSettingsProvider } from './context/ToolSettingsProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <ToolSettingsProvider>
        <App />
      </ToolSettingsProvider>
    </SocketProvider>
  </StrictMode>
)
