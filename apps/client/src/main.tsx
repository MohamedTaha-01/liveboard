import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import SocketProvider from "./context/SocketProvider.tsx";
import WhiteboardProvider from "./context/WhiteboardProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <WhiteboardProvider>
        <App />
      </WhiteboardProvider>
    </SocketProvider>
  </StrictMode>
);
