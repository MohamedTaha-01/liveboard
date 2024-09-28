import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "../../pages/LandingPage";
import WhiteboardPage from "../../pages/WhiteboardPage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/whiteboard/:id" element={<WhiteboardPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
