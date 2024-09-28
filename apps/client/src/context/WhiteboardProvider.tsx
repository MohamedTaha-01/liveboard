import { createContext, ReactNode, useState } from "react";

export const WhiteboardContext = createContext<{ whiteboardId: string | undefined; setWhiteboardId: (whiteboardId: string) => void } | undefined>(undefined);
function WhiteboardProvider({ children }: { children: ReactNode }) {
  const [whiteboardId, setWhiteboardId] = useState<string>("");

  return <WhiteboardContext.Provider value={{ whiteboardId, setWhiteboardId }}>{children}</WhiteboardContext.Provider>;
}

export default WhiteboardProvider;
