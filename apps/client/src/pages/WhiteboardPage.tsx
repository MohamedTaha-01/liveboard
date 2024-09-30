import { useLocation, useNavigate } from "react-router-dom";
import Whiteboard from "../components/Whiteboard/Whiteboard";
import { SocketContext } from "../context/SocketProvider";
import { useContext, useEffect, useState } from "react";
import { TSocketResponse } from "../types/types";
import ToolSettings from "../components/Whiteboard/ToolSettings";
import { IWhiteboard } from "../types/whiteboard";

function WhiteboardPage() {
  const { socket } = useContext(SocketContext)!;
  const location = useLocation();
  const navigate = useNavigate();

  const [whiteboard, setWhiteboard] = useState<IWhiteboard>({
    id: undefined,
    owner: undefined,
    content: [],
    visibility: "private",
  });

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
    setWhiteboard(res.whiteboard);
  };

  const handleChangeVisibility = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVisibility = e.target.value;
    if (newVisibility !== "private" && newVisibility !== "public") return;

    const res = await socket.emitWithAck("whiteboard:change-visibility", whiteboard.id, newVisibility);
    console.log(res);
    if (res.status !== 200) return;
    setWhiteboard((prev) => {
      return { ...prev, visibility: res.whiteboard.visibility };
    });
  };

  useEffect(() => {
    if (!socket) {
      console.log("socket not connected");
      return navigate("/");
    }
    joinWhiteboard();
  }, [socket]);

  return (
    (socket && (
      <>
        <Whiteboard whiteboard={whiteboard} setWhiteboard={setWhiteboard} />
        <section style={{ position: "absolute", top: 0, left: 0 }}>
          <p>Visibility</p>
          <select value={whiteboard.visibility} onChange={handleChangeVisibility}>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </section>
        <ToolSettings />
        <section style={{ position: "absolute", right: 0, top: 40, textAlign: "right" }}>
          <p>ID: {whiteboard.id}</p>
          <p>Owner: {whiteboard.owner}</p>
          <p>Vis: {whiteboard.visibility}</p>
        </section>
      </>
    )) || <p>Not connected</p>
  );
}

export default WhiteboardPage;
