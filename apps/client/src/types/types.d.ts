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
  lineCap: string;
  lineJoin: string;
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
