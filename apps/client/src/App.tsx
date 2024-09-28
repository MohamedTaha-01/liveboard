import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WhiteboardPage from "./pages/WhiteboardPage";
import { io, Socket } from "socket.io-client";
import { useState } from "react";
import DebugMenu from "./components/DebugMenu/DebugMenu";

const socket: Socket = io("http://localhost:3002", {
  withCredentials: true,
});

function App() {
  const [whiteboardId, setWhiteboardId] = useState<string>("");
  const [socketId, setSocketId] = useState<string>("");

  socket.on("connect", () => {
    console.log("connected with ID", socket.id);
    setSocketId(socket.id!);
  });

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/whiteboard/:id" element={<WhiteboardPage socket={socket} whiteboardId={whiteboardId} />} />
          <Route path="/" element={<LandingPage socket={socket} setWhiteboardId={setWhiteboardId} />} />
        </Routes>
      </BrowserRouter>
      {import.meta.env.VITE_PROD && <DebugMenu socketId={socketId} whiteboardId={whiteboardId} />}
    </main>
  );
}

export default App;
