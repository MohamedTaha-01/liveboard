import { Stage, Layer, Line } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { TLineD, TPosition, TSocketResponse } from "../../types/types";
import { useContext, useRef } from "react";
import { Stage as TStage } from "konva/lib/Stage";
import { SocketContext } from "../../context/SocketProvider";
import { ToolSettingsContext } from "../../context/ToolSettingsProvider";
import { IWhiteboard } from "../../types/whiteboard";

function Whiteboard({ whiteboard, setWhiteboard }: { whiteboard: IWhiteboard; setWhiteboard: React.Dispatch<React.SetStateAction<IWhiteboard>> }) {
  const { socket } = useContext(SocketContext)!;

  const isDrawing = useRef(false);
  const stageRef = useRef<TStage>(null);

  const toolSettings = useContext(ToolSettingsContext);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos: { x: number; y: number } = e.target.getStage()?.getPointerPosition() as TPosition;
    setWhiteboard((prev) => {
      return {
        ...prev,
        content: [
          ...whiteboard.content,
          {
            attrs: {
              points: [pos.x, pos.y],
              stroke: toolSettings.color,
              strokeWidth: parseInt(toolSettings.size),
              tension: 0.5,
              lineCap: "round",
              lineJoin: "round",
              globalCompositeOperation: toolSettings.tool === "pen" ? "source-over" : "destination-out",
            },
            className: "Line",
          },
        ],
      };
    });
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition() as TPosition;
    const lastLine = whiteboard.content[whiteboard.content.length - 1];
    // add point
    lastLine.attrs.points = lastLine.attrs.points.concat([point.x, point.y]);

    // replace last
    whiteboard.content.splice(whiteboard.content.length - 1, 1, lastLine);
    setWhiteboard((prev) => {
      return { ...prev, content: whiteboard.content.concat() };
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    const lastLine = whiteboard.content[whiteboard.content.length - 1];
    socket.emit("whiteboard:draw", whiteboard.id, lastLine, (res: TSocketResponse) => {
      console.log("emmited draw order, received status:", res.status);
    });
  };

  //! DEBUG // //
  const handleStageSave = () => {
    console.log(stageRef.current?.toJSON());
  };
  //! // // // //

  socket.on("whiteboard:render", (newLine: TLineD) => {
    console.log("received render order");
    setWhiteboard((prev) => {
      return { ...prev, content: [...prev.content, newLine] };
    });
  });

  return (
    <>
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <button onClick={handleStageSave}>Save stage</button>
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}>
        <Layer>
          {whiteboard &&
            whiteboard.content &&
            whiteboard.content.map((line, j) => (
              <Line
                key={j}
                points={line.attrs.points}
                stroke={line.attrs.stroke}
                strokeWidth={line.attrs.strokeWidth}
                tension={line.attrs.tension}
                lineCap={line.attrs.lineCap}
                lineJoin={line.attrs.lineJoin}
                globalCompositeOperation={line.attrs.globalCompositeOperation === "destination-out" ? "destination-out" : "source-over"}
              />
            ))}
        </Layer>
      </Stage>
    </>
  );
}

export default Whiteboard;
