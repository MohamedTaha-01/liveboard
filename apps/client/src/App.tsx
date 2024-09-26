import { io } from "socket.io-client";
import Whiteboard from "./components/Whiteboard/Whiteboard";

function App() {
  const socket = io("http://localhost:3002", {
    withCredentials: true,
  });

  return (
    <div>
      <div>
        <button>Create whiteboard</button>
        <button>Join whiteboard</button>
      </div>
      <Whiteboard />
    </div>
  );
}

export default App;
