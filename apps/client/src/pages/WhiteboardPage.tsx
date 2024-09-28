import { useLocation, useNavigate } from "react-router-dom";
import Whiteboard from "../components/Whiteboard/Whiteboard";
import { SocketContext } from "../context/SocketProvider";
import { useContext } from "react";
import { WhiteboardContext } from "../context/WhiteboardProvider";
import { TSocketResponse } from "../types/types";

function WhiteboardPage() {
  const { socket } = useContext(SocketContext)!;
  const { setWhiteboardId } = useContext(WhiteboardContext)!;
  const location = useLocation();
  const navigate = useNavigate();

  if (socket) {
    const joinWhiteboard = async () => {
      console.log("joining whiteboard", location.pathname.split("/whiteboard/")[1]);

      const whiteboardCode = location.pathname.split("/whiteboard/")[1];
      const res: TSocketResponse = await socket.emitWithAck("whiteboard:join", whiteboardCode);
      if (res.status === 403) {
        navigate(`/`);
      }
      if (res.status !== 200) return;
      setWhiteboardId(res.whiteboard.id);
    };

    joinWhiteboard();
  }

  return <section>{socket && <Whiteboard />}</section>;
}

export default WhiteboardPage;
