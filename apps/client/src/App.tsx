import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WhiteboardPage from "./pages/WhiteboardPage";

function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/whiteboard/:id" element={<WhiteboardPage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
