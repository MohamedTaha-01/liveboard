import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

function LandingPage({ socket, setWhiteboardId }: { socket: Socket; setWhiteboardId: (whiteboardId: string) => void }) {
  const navigate = useNavigate();
  const wbCodeInputRef = useRef<HTMLInputElement>(null);

  const handleWhiteboardCreate = async () => {
    const res = await socket.emitWithAck("whiteboard:create");
    console.log("created:", res);
    setWhiteboardId(res.whiteboard.id);
    navigate(`/whiteboard/${res.whiteboard.id}`);
  };

  const handleWhiteboardJoin = () => {
    // TODO Validate input and if whiteboard exists
    const whiteboardCode = wbCodeInputRef.current?.value;
    socket.emit("whiteboard:join", whiteboardCode, (res) => {
      if (res.status !== 200) return;
      setWhiteboardId(res.whiteboard.id);
      navigate(`/whiteboard/${res.whiteboard.id}`);
    });
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

export default LandingPage;
