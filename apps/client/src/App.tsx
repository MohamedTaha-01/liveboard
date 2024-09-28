import { useContext, useEffect, useState } from "react";
import DebugMenu from "./components/DebugMenu/DebugMenu";
import { SocketContext } from "./context/SocketProvider";
import { s } from "./socket";
import Router from "./components/Router/Router";

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
      <Router whiteboardId={whiteboardId} setWhiteboardId={setWhiteboardId} />
      {import.meta.env.VITE_PROD && <DebugMenu whiteboardId={whiteboardId} />}
    </main>
  );
}

export default App;
