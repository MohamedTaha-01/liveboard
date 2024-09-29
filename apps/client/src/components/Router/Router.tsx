import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import WhiteboardPage from "../../pages/WhiteboardPage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/whiteboard/:id" element={<WhiteboardPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
