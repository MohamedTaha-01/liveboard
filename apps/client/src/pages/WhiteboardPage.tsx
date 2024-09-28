import { useLocation } from "react-router-dom";
import Whiteboard from "../components/Whiteboard/Whiteboard";

function WhiteboardPage() {
  const location = useLocation();
  console.log(location.pathname.split("/whiteboard/")[1]);

  return (
    <section>
      <Whiteboard />
    </section>
  );
}

export default WhiteboardPage;
