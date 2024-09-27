import { io } from "socket.io-client";
import Whiteboard from "../components/Whiteboard/Whiteboard";

function WhiteboardPage() {
  const socket = io("http://localhost:3002", {
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("connected with ID", socket.id);
  });

  return (
    <section>
      <Whiteboard />
    </section>
  );
}

export default WhiteboardPage;
