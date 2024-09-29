import { useLocation, useNavigate } from "react-router-dom";
import Whiteboard from "../components/Whiteboard/Whiteboard";
import { SocketContext } from "../context/SocketProvider";
import { useContext, useState } from "react";
import { WhiteboardContext } from "../context/WhiteboardProvider";
import { TSocketResponse } from "../types/types";

function WhiteboardPage() {
  const { socket } = useContext(SocketContext)!;
  const { setWhiteboardId } = useContext(WhiteboardContext)!;
  const location = useLocation();
  const navigate = useNavigate();

  if (socket) {
    const joinWhiteboard = async () => {
      console.log("joining whiteboard", location.pathname.split("/whiteboards/")[1]);

      const whiteboardCode = location.pathname.split("/whiteboards/")[1];
      const res: TSocketResponse = await socket.emitWithAck("whiteboard:join", whiteboardCode);
      console.log(res);
      if (res.status === 403) {
        console.log("not authorized");
        navigate(`/`);
      }
      if (res.status === 404) {
        console.log("whiteboard not found");

        navigate(`/`);
      }
      if (res.status !== 200) return;
      setWhiteboardId(res.whiteboard.id);
    };

    joinWhiteboard();
  }

  // TODO: everything below is added here temporarily

  const { whiteboardId } = useContext(WhiteboardContext)!;

  const [tool, setTool] = useState("pen");
  const [size, setSize] = useState("5");
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
        <Whiteboard tool={tool} size={size} visibility={visibility} />
        <section style={{ position: "absolute", top: 0, left: 0 }}>
          <p>Visibility</p>
          <select value={visibility} onChange={handleChangeVisibility}>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </section>
        <section style={{ position: "absolute", top: 40, left: 0 }}>
          <p>Tool</p>
          <select
            value={tool}
            onChange={(e) => {
              setTool(e.target.value);
            }}>
            <option value="pen">Pen</option>
            <option value="eraser">Eraser</option>
          </select>
          <select
            value={size}
            onChange={(e) => {
              setSize(e.target.value);
            }}>
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </section>
      </>
    )) || <p>Not connected</p>
  );
}

export default WhiteboardPage;
