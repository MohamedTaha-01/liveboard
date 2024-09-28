export type TSocketResponse = {
  status: number;
  message?: string;
  error?: string;
  [x: string]: IWhiteboard | never;
};
export interface IWhiteboard {
  id: string;
  content: TStageD[];
}

export type TStageD = {
  attrs: object;
  className: string;
  children: TLayerD[];
};

export type TLayerD = {
  attrs: object;
  className: string;
  children: TLineD[];
};

export type TLineD = {
  attrs: TLineAttrsD;
  className: string;
};

export type TLineAttrsD = {
  points: number[];
  stroke: string;
  strokeWidth: number;
  tension: number;
  lineCap: "butt" | "round" | "square";
  lineJoin: "bevel" | "miter" | "round";
  globalCompositeOperation?: string;
};

export type TLine = {
  points: number[];
  tool: string;
};

export type TPosition = {
  x: number;
  y: number;
};
