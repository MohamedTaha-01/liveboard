import Whiteboard from "../components/Whiteboard/Whiteboard";

function WhiteboardPage({ socket, whiteboardId }) {
  return (
    <section>
      <Whiteboard socket={socket} whiteboardId={whiteboardId} />
    </section>
  );
}

export default WhiteboardPage;
