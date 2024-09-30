import { useLocation, useNavigate } from "react-router-dom";
import Whiteboard from "../components/Whiteboard/Whiteboard";
import { SocketContext } from "../context/SocketProvider";
import { useContext, useState } from "react";
import { WhiteboardContext } from "../context/WhiteboardProvider";
import { TSocketResponse } from "../types/types";
import ToolSettings from "../components/Whiteboard/ToolSettings";

function WhiteboardPage() {
  const { socket } = useContext(SocketContext)!;
  const { setWhiteboardId } = useContext(WhiteboardContext)!;
  const location = useLocation();
  const navigate = useNavigate();

  if (!socket) {
    navigate("/");
  }

  const joinWhiteboard = async () => {
    console.log("joining whiteboard", location.pathname.split("/whiteboards/")[1]);

    const whiteboardCode = location.pathname.split("/whiteboards/")[1];
    const res: TSocketResponse = await socket.emitWithAck("whiteboard:join", whiteboardCode);
    console.log(res);
    if (res.status === 404) {
      console.log("whiteboard not found");
      navigate(`/`);
    }
    if (res.status === 403) {
      console.log("not authorized");
      navigate(`/`);
    }
    if (res.status !== 200) return;
    setWhiteboardId(res.whiteboard.id);
  };

  joinWhiteboard();

  // TODO: everything below is added here temporarily

  const { whiteboardId } = useContext(WhiteboardContext)!;

  const [visibility, setVisibility] = useState<string>("private");

  const handleChangeVisibility = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVisibility = e.target.value;
    if (newVisibility !== "private" && newVisibility !== "public") return;
    setVisibility(e.target.value);

    const res = await socket.emitWithAck("whiteboard:change-visibility", whiteboardId, newVisibility);
    console.log(res);

    if (res.status !== 200) {
      setVisibility(res.whiteboard.visibility);
      return;
    }
  };

  return (
    (socket && (
      <>
        <Whiteboard />
        <section style={{ position: "absolute", top: 0, left: 0 }}>
          <p>Visibility</p>
          <select value={visibility} onChange={handleChangeVisibility}>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </section>
        <ToolSettings />
      </>
    )) || <p>Not connected</p>
  );
}

export default WhiteboardPage;
