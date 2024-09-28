import { useLocation } from "react-router-dom";
import Whiteboard from "../components/Whiteboard/Whiteboard";

function WhiteboardPage({ whiteboardId }: { whiteboardId: string }) {
  const location = useLocation();
  console.log(location.pathname.split("/whiteboard/")[1]);

  return (
    <section>
      <Whiteboard whiteboardId={whiteboardId} />
    </section>
  );
}

export default WhiteboardPage;
