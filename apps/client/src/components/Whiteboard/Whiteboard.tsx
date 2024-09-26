import { Stage, Layer, Line } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { TLine, TPosition } from "../../types/types";
import { useRef, useState } from "react";

function Whiteboard() {
  const [tool, setTool] = useState("pen");
  const [lines, setLines] = useState<TLine[]>([]);
  const isDrawing = useRef(false);

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

  return (
    <section>
      <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleMouseDown} onMousemove={handleMouseMove} onMouseup={handleMouseUp}>
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
      <select
        value={tool}
        onChange={(e) => {
          setTool(e.target.value);
        }}>
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
    </section>
  );
}

export default Whiteboard;
