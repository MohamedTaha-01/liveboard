import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import WhiteboardPage from "./pages/WhiteboardPage";
import { useContext, useEffect, useState } from "react";
import DebugMenu from "./components/DebugMenu/DebugMenu";
import { SocketContext } from "./context/SocketProvider";
import { s } from "./socket";

function App() {
  const [whiteboardId, setWhiteboardId] = useState<string>("");
  const { setSocket } = useContext(SocketContext)!;

  useEffect(() => {
    s.on("connect", () => {
      console.log("connected with ID", s.id);
      setSocket(s);
    });

    return () => {
      s.off("connect", () => {
        console.log("disconnected");
        setSocket(undefined);
      });
    };
  }, []);

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/whiteboard/:id" element={<WhiteboardPage whiteboardId={whiteboardId} />} />
          <Route path="/" element={<LandingPage setWhiteboardId={setWhiteboardId} />} />
        </Routes>
      </BrowserRouter>
      {import.meta.env.VITE_PROD && <DebugMenu whiteboardId={whiteboardId} />}
    </main>
  );
}

export default App;
