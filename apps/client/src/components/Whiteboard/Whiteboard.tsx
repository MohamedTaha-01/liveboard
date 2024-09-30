import { Stage, Layer, Line, Rect } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { TWhiteboardElement, TPosition, TSocketResponse, TWhiteboardRectAttrs } from "../../types/types";
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

  const handleDragStart = (e: KonvaEventObject<MouseEvent>) => {
    const id = e.target.id();
    setWhiteboard((prev) => {
      return {
        ...prev,
        content: prev.content.map((el: TWhiteboardElement) => {
          return { ...el, isDragging: el.id === id };
        }),
      };
    });
  };
  const handleDragEnd = async (e: KonvaEventObject<MouseEvent>) => {
    const id = e.target.id();
    setWhiteboard((prev) => {
      return {
        ...prev,
        content: prev.content.map((el: TWhiteboardElement) => {
          return { ...el, isDragging: false };
        }),
      };
    });
    const movedElement = whiteboard.content.find((el) => el.id === id);
    const res: TSocketResponse = await socket.emitWithAck("whiteboard:move", whiteboard.id, movedElement);
    console.log("emmited move order, received status:", res.status);
  };

  //! DEBUG // //
  const handleStageSave = () => {
    console.log(stageRef.current?.toJSON());
  };
  //! // // // //

  socket.on("whiteboard:render", (newLine: TWhiteboardElement) => {
    console.log("received render order");
    setWhiteboard((prev) => {
      return { ...prev, content: [...prev.content, newLine] };
    });
  });

  return (
    <>
      <div style={{ position: "absolute", top: 0, right: 0, zIndex: 100 }}>
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
            whiteboard.content.map((element: TWhiteboardElement, i) => {
              if (element.className === "Line")
                return (
                  <Line
                    key={i}
                    points={element.attrs.points}
                    stroke={element.attrs.stroke}
                    strokeWidth={element.attrs.strokeWidth}
                    tension={element.attrs.tension}
                    lineCap={element.attrs.lineCap}
                    lineJoin={element.attrs.lineJoin}
                    globalCompositeOperation={element.attrs.globalCompositeOperation === "destination-out" ? "destination-out" : "source-over"}
                  />
                );
              else if (element.className === "Rect")
                return (
                  <Rect
                    key={i}
                    id={element.id}
                    x={element.attrs.x}
                    y={element.attrs.y}
                    width={element.attrs.width}
                    height={element.attrs.height}
                    fill={element.attrs.fill}
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    opacity={element.isDragging ? 0.7 : 1}
                  />
                );
              else return <></>;
            })}
        </Layer>
      </Stage>
    </>
  );
}

export default Whiteboard;
