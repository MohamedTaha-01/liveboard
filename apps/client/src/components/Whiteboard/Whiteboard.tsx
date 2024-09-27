import { Stage, Layer, Line } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { TLine, TPosition, TStageD } from "../../types/types";
import { useRef, useState } from "react";
import { Stage as TStage } from "konva/lib/Stage";

function Whiteboard() {
  const [stage, setStage] = useState<TStageD | null>(null);
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState<TLine[]>([]);
  const isDrawing = useRef(false);
  const stageRef = useRef<TStage>(null);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos: { x: number; y: number } = e.target.getStage()?.getPointerPosition() as TPosition;
    setLines([...lines, { tool, points: [pos?.x, pos?.y] }]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition() as TPosition;
    const lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleStageSave = () => {
    console.log(stageRef.current?.toJSON());
  };

  const handleStageLoad = () => {
    setStage({
      attrs: { width: 1422, height: 386 },
      className: "Stage",
      children: [
        {
          attrs: {},
          className: "Layer",
          children: [
            {
              attrs: {
                points: [
                  233.00152013726907, 175.00210305008676, 243.00158537921195, 174.0020910326577, 269.00175500826344, 168.0020189280833, 315.00205512120067,
                  153.00183866664727, 389.002537911578, 139.00167042264033, 451.0029424116238, 131.0015742832078, 512.0033403874753, 122.00146612634619,
                  568.0037057423555, 115.00138200434272, 623.0040645730413, 107.00128586491019, 668.0043581617842, 99.00118972547764, 705.004599556973,
                  95.00114165576137, 720.0046974198872, 95.00114165576137, 725.0047300408587, 95.00114165576137, 729.0047561376358, 95.00114165576137,
                  727.0047430892472, 101.00121376033579, 720.0046974198872, 112.00134595205552, 701.0045734601957, 132.00158630063686, 671.0043777343672,
                  155.00186270150542, 628.0040971940127, 184.00221120694835, 593.0038688472126, 204.0024515555297, 554.0036144036354, 224.00269190411103,
                  526.0034317261953, 236.00283611325983, 511.00333386328106, 241.0028962004052, 502.0032751455325, 245.00294427012145, 500.00326209714393,
                  246.00295628755052, 499.0032555729496, 246.00295628755052, 506.00330124230965, 241.0028962004052, 510.0033273390868, 238.00286014811797,
                ],
                stroke: "#df4b26",
                strokeWidth: 5,
                tension: 0.5,
                lineCap: "round",
                lineJoin: "round",
              },
              className: "Line",
            },
          ],
        },
      ],
    });
  };

  return (
    <>
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}>
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
      <button onClick={handleStageSave}>Save stage</button>
      <button onClick={handleStageLoad}>Load stage</button>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}>
        {stage &&
          stage.children &&
          stage.children.map((layer, i) => (
            <Layer key={i}>
              {layer.children &&
                layer.children.map((line, j) => (
                  <Line
                    key={j}
                    points={line.attrs.points}
                    stroke={line.attrs.stroke}
                    strokeWidth={line.attrs.strokeWidth}
                    tension={line.attrs.tension}
                    lineCap="round"
                    lineJoin="round"
                  />
                ))}
            </Layer>
          ))}
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke="#df4b26"
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={line.tool === "eraser" ? "destination-out" : "source-over"}
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
}

export default Whiteboard;
