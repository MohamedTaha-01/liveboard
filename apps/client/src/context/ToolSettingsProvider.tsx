import React, { createContext, useState } from "react";
import { TWhiteboardTool } from "../types/whiteboard";

interface IToolSettingsContext {
  tool: TWhiteboardTool;
  size: number;
  color: string;
  changeTool: (t: TWhiteboardTool) => void;
  changeSize: (s: number) => void;
  changeColor: (c: string) => void;
}

export const ToolSettingsContext = createContext<IToolSettingsContext | undefined>(undefined);

export const ToolSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [tool, setTool] = useState<TWhiteboardTool>("pen");
  const [size, setSize] = useState<number>(5);
  const [color, setColor] = useState<string>("#df4b26");

  const changeTool = (t: TWhiteboardTool) => {
    if (t !== "pen" && t !== "eraser") return;
    setTool(t);
  };
  const changeSize = (s: number) => setSize(s);
  const changeColor = (c: string) => setColor(c);

  return <ToolSettingsContext.Provider value={{ tool, size, color, changeTool, changeSize, changeColor }}>{children}</ToolSettingsContext.Provider>;
};
