/**
 * Whiteboard global state
 * @prop {string} id - The whiteboard's id
 * @prop {string} owner - The whiteboard's owner id
 * @prop {TLineD[]} content - The whiteboard's content
 * @prop {string} visibility - The whiteboard's visibility
 */
export interface IWhiteboard {
  id: string;
  owner: string;
  content: TLineD[];
  visibility: string;
}

/**
 * Whiteboard tool settings (local) state
 * @prop {string} tool - The selected tool
 * @prop {string} size - The selected tool size
 */
export interface IToolSettings {
  tool: string;
  size: string;
}

export type TWhiteboardTool = "pen" | "eraser";
