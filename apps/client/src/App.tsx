import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WhiteboardPage from "./pages/WhiteboardPage";
import { io, Socket } from "socket.io-client";
import { useState } from "react";

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
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          fontSize: 14,
          background: "#e3e3e3",
          padding: 8,
          border: "1px solid #ccc",
          borderRadius: 8,
          opacity: 0.8,
        }}>
        <h4 style={{ textAlign: "center", marginBottom: 8 }}>DEBUG</h4>
        <p>
          <b>Socket ID:</b> {socketId}
        </p>
        <p>
          <b>Whiteboard ID:</b> {whiteboardId}
        </p>
      </div>
    </main>
  );
}

export default App;
