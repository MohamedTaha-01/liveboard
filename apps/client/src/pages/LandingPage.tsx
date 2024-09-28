import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { TSocketResponse } from "../types/types";
import { SocketContext } from "../context/SocketProvider";

function LandingPage({ setWhiteboardId }: { setWhiteboardId: (whiteboardId: string) => void }) {
  const { socket } = useContext(SocketContext)!;
  const navigate = useNavigate();
  const wbCodeInputRef = useRef<HTMLInputElement>(null);

  const handleWhiteboardCreate = async () => {
    const res = await socket.emitWithAck("whiteboard:create");
    console.log("created:", res);
    setWhiteboardId(res.whiteboard.id);
    navigate(`/whiteboard/${res.whiteboard.id}`);
  };

  const handleWhiteboardJoin = async () => {
    // TODO Validate input and if whiteboard exists
    const whiteboardCode = wbCodeInputRef.current?.value;
    const res: TSocketResponse = await socket.emitWithAck("whiteboard:join", whiteboardCode);
    console.log(res);
    if (res.status !== 200) return;
    setWhiteboardId(res.whiteboard.id);
    navigate(`/whiteboard/${res.whiteboard.id}`);
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
