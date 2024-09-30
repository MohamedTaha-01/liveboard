import { useContext } from "react";
import { SocketContext } from "../../context/SocketProvider";

function DebugMenu() {
  const { socket } = useContext(SocketContext)!;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        fontSize: 14,
        background: "#e3e3e3",
        padding: 16,
        border: "1px solid #ccc",
        borderRadius: 8,
        opacity: 0.8,
      }}>
      <h1 style={{ textAlign: "center", marginBottom: 8, fontSize: 20 }}>DEV MENU</h1>
      <h2 style={{ fontSize: 18 }}>Socket</h2>
      <ul style={{ listStyle: "none" }}>
        <li>ID: {socket && socket.id}</li>
      </ul>
    </div>
  );
}

export default DebugMenu;
