import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../../pages/LandingPage";
import WhiteboardPage from "../../pages/WhiteboardPage";

function Router({ whiteboardId, setWhiteboardId }: { whiteboardId: string; setWhiteboardId: (whiteboardId: string) => void }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/whiteboard/:id" element={<WhiteboardPage whiteboardId={whiteboardId} />} />
        <Route path="/" element={<LandingPage setWhiteboardId={setWhiteboardId} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
