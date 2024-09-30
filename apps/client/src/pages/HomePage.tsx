import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketProvider";

function HomePage() {
  const { socket } = useContext(SocketContext)!;

  const navigate = useNavigate();
  const wbCodeInputRef = useRef<HTMLInputElement>(null);

  const handleWhiteboardCreate = async () => {
    const res = await socket.emitWithAck("whiteboard:create");
    // TODO handle res errors
    console.log("created:", res);
    navigate(`/whiteboards/${res.whiteboard.id}`);
  };

  const handleWhiteboardJoin = async () => {
    // TODO Validate input and if whiteboard exists
    navigate(`/whiteboards/${wbCodeInputRef.current?.value}`);
  };

  return (
    <section>
      <button onClick={handleWhiteboardCreate}>Create whiteboard</button>
      &nbsp;&nbsp;
      <input ref={wbCodeInputRef} type="text" placeholder="whiteboard code" />
      <button onClick={handleWhiteboardJoin}>Join whiteboard</button>
    </section>
  );
}

export default HomePage;
