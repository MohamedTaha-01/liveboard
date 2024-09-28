import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WhiteboardPage from "./pages/WhiteboardPage";
import { io, Socket } from "socket.io-client";
import { useState } from "react";

function App() {
  const [whiteboardId, setWhiteboardId] = useState<string>("");

  const socket: Socket = io("http://localhost:3002", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("connected with ID", socket.id);
  });

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/whiteboard/:id" element={<WhiteboardPage socket={socket} whiteboardId={whiteboardId} />} />
          <Route path="/" element={<LandingPage socket={socket} setWhiteboardId={setWhiteboardId} />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
