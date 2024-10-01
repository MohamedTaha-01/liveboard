import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from '../../pages/HomePage'
import WhiteboardPage from '../../pages/WhiteboardPage'
import NoMatchPage from '../../pages/NoMatchPage'

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
