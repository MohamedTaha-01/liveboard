import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketProvider";
import { WhiteboardContext } from "../context/WhiteboardProvider";

function HomePage() {
  const { socket } = useContext(SocketContext)!;
  const { setWhiteboardId } = useContext(WhiteboardContext)!;

  const navigate = useNavigate();
  const wbCodeInputRef = useRef<HTMLInputElement>(null);

  const handleWhiteboardCreate = async () => {
    const res = await socket.emitWithAck("whiteboard:create");
    console.log("created:", res);
    setWhiteboardId(res.whiteboard.id);
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
