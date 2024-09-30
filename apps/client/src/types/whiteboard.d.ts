import { TWhiteboardElement } from "./types";

/**
 * Whiteboard global state
 * @prop {string} id - The whiteboard's id
 * @prop {string} owner - The whiteboard's owner id
 * @prop {TWhiteboardElement[]} content - The whiteboard's content
 * @prop {string} visibility - The whiteboard's visibility
 */
export interface IWhiteboard {
  id: string | undefined;
  owner: string | undefined;
  content: TWhiteboardElement[];
  visibility: "public" | "private";
}

export interface IToolSettingsContext {
  tool: TWhiteboardTool;
  size: number;
  color: string;
  changeTool: (t: TWhiteboardTool) => void;
  changeSize: (s: number) => void;
  changeColor: (c: string) => void;
}

export type TWhiteboardTool = "pen" | "eraser";
