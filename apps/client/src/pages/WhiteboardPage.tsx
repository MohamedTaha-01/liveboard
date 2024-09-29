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

  return <section>{socket && <Whiteboard />}</section>;
}

export default WhiteboardPage;
