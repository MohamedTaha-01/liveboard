import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const wbCodeInputRef = useRef<HTMLInputElement>(null);

  const handleCreateWhiteboard = async () => {
    const res = await fetch("http://localhost:3002/whiteboard", {
      method: "POST",
    });
    const data = await res.json();
    navigate(`/whiteboard/${data.whiteboard.id}`);
  };

  const handleJoinWhiteboard = async () => {
    // TODO Validate input and if whiteboard exists
    const whiteboardCode = wbCodeInputRef.current?.value;
    navigate(`/whiteboard/${whiteboardCode}`);
  };

  return (
    <section>
      <button onClick={handleCreateWhiteboard}>Create whiteboard</button>
      &nbsp;&nbsp;
      <input ref={wbCodeInputRef} type="text" placeholder="whiteboard code" />
      <button onClick={handleJoinWhiteboard}>Join whiteboard</button>
    </section>
  );
}

export default LandingPage;
