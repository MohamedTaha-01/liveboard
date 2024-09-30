import { useContext } from "react";
import { SocketContext } from "../../context/SocketProvider";
import { WhiteboardContext } from "../../context/WhiteboardProvider";
import { ToolSettingsContext } from "../../context/ToolSettingsProvider";

function DebugMenu() {
  const { socket } = useContext(SocketContext)!;
  const { whiteboardId } = useContext(WhiteboardContext)!;
  const toolSettings = useContext(ToolSettingsContext);

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
      <details>
        <summary>
          <h2 style={{ fontSize: 18 }}>Socket</h2>
        </summary>
        <ul style={{ listStyle: "none" }}>
          <li>ID: {socket && socket.id}</li>
        </ul>
      </details>
      <hr style={{ marginTop: 8, marginBottom: 8 }} />
      <details>
        <summary>
          <h2 style={{ fontSize: 18 }}>Whiteboard</h2>
        </summary>
        <ul style={{ listStyle: "none" }}>
          <li>Whiteboard ID: {whiteboardId && whiteboardId}</li>
          <li>Owner: null</li>
          <li>Visibility: null</li>
        </ul>
        <h3>Tool settings</h3>
        <ul style={{ listStyle: "none" }}>
          <li>Tool: {toolSettings.tool}</li>
          <li>Size: {toolSettings.size}</li>
          <li>Color: {toolSettings.color}</li>
        </ul>
      </details>
    </div>
  );
}

export default DebugMenu;
