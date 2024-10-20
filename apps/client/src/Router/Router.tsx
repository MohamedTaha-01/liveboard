import HomePage from '@/pages/HomePage'
import NoMatchPage from '@/pages/NoMatchPage'
import WhiteboardPage from '@/pages/WhiteboardPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/whiteboards/:id" element={<WhiteboardPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NoMatchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
