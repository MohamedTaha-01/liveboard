import { useContext, useEffect } from "react";
import DebugMenu from "./components/DebugMenu/DebugMenu";
import { SocketContext } from "./context/SocketProvider";
import { s } from "./socket";
import Router from "./components/Router/Router";

function App() {
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
      <Router />
      {import.meta.env.VITE_PROD && <DebugMenu />}
    </main>
  );
}

export default App;
