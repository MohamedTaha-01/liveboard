import { useContext } from "react";
import { SocketContext } from "../../context/SocketProvider";

function DebugMenu({ whiteboardId }: { whiteboardId: string }) {
  const { socket } = useContext(SocketContext)!;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        fontSize: 14,
        background: "#e3e3e3",
        padding: 8,
        border: "1px solid #ccc",
        borderRadius: 8,
        opacity: 0.8,
      }}>
      <h4 style={{ textAlign: "center", marginBottom: 8 }}>DEBUG</h4>
      <p>
        <b>Socket ID:</b> {socket && socket.id}
      </p>
      <p>
        <b>Whiteboard ID:</b> {whiteboardId}
      </p>
    </div>
  );
}

export default DebugMenu;
