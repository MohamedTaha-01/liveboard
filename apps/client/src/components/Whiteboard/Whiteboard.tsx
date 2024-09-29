import { Stage, Layer, Line } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { TLineD, TPosition, TSocketResponse } from "../../types/types";
import { useContext, useRef, useState } from "react";
import { Stage as TStage } from "konva/lib/Stage";
import { SocketContext } from "../../context/SocketProvider";
import { WhiteboardContext } from "../../context/WhiteboardProvider";
import { ToolSettingsContext } from "../../context/ToolSettingsProvider";

function Whiteboard({ visibility }: { visibility: string }) {
  const { socket } = useContext(SocketContext)!;
  const { whiteboardId } = useContext(WhiteboardContext)!;

  const [stageContent, setStageContent] = useState<TLineD[]>([]);

  const isDrawing = useRef(false);
  const stageRef = useRef<TStage>(null);

  const toolSettings = useContext(ToolSettingsContext);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = true;
    const pos: { x: number; y: number } = e.target.getStage()?.getPointerPosition() as TPosition;
    setStageContent([
      ...stageContent,
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
    ]);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    // no drawing - skipping
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition() as TPosition;
    const lastLine = stageContent[stageContent.length - 1];
    // add point
    lastLine.attrs.points = lastLine.attrs.points.concat([point.x, point.y]);

    // replace last
    stageContent.splice(stageContent.length - 1, 1, lastLine);
    setStageContent(stageContent.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    const lastLine = stageContent[stageContent.length - 1];
    socket.emit("whiteboard:draw", whiteboardId, lastLine, (res: TSocketResponse) => {
      console.log("emmited draw order, received status:", res.status);
    });
  };

  const handleStageSave = () => {
    console.log(stageRef.current?.toJSON());
  };

  const handleStageLoad = () => {
    setStageContent([
      {
        attrs: {
          points: [
            258.00168324212626, 183.74173742790185, 259.00168976632057, 184.7417428469404, 260.0016962905148, 184.7417428469404, 262.0017093389034,
            184.7417428469404, 268.00174848406914, 181.7417265898247, 275.00179415342916, 176.7416994946319, 283.0018463469834, 167.74165072328478,
            292.00190506473206, 155.741585694822, 311.0020290244235, 135.74147731405068, 334.0021790808921, 110.74134183808656, 371.0024204760808,
            85.74120636212241, 402.0026227261037, 68.74111423846679, 440.0028706454866, 55.74104379096544, 467.0030467987324, 46.740995019618346,
            488.00318380681244, 41.74096792442552, 502.0032751455325, 39.74095708634839, 516.0033664842525, 37.74094624827126, 526.0034317261953,
            37.74094624827126, 535.003490443944, 37.74094624827126, 540.0035230649154, 37.74094624827126, 542.003536113304, 38.74095166730982,
            545.0035556858869, 39.74095708634839, 548.0035752584697, 44.740984181541215, 551.0035948310526, 48.74100585769548, 554.0036144036354,
            55.74104379096544, 555.0036209278297, 61.741076305196835, 560.0036535488011, 70.74112507654392, 565.0036861697727, 81.74118468596815,
            571.0037253149384, 93.74124971443094, 577.0037644601041, 106.74132016193228, 591.0038557988241, 121.74140144751077, 605.0039471375442,
            135.74147731405068, 621.0040515246527, 149.7415531805906, 645.0042081053157, 164.7416344661691, 665.0043385892014, 175.7416940755933,
            684.0044625488929, 181.7417265898247, 702.00457998439, 185.74174826597897, 719.004690895693, 187.74175910405611, 734.0047887586072,
            187.74175910405611, 747.004873573133, 187.74175910405611, 759.0049518634645, 187.74175910405611, 766.0049975328245, 184.7417428469404,
            777.0050692989616, 180.74172117078615, 781.0050953957387, 178.741710332709, 786.0051280167103, 174.74168865655474, 788.0051410650988,
            172.74167781847763, 790.0051541134874, 170.74166698040048, 790.0051541134874, 170.74166698040048, 790.0051541134874, 168.74165614232336,
            790.0051541134874, 167.74165072328478, 790.0051541134874, 167.74165072328478, 788.0051410650988, 165.74163988520766,
          ],
          stroke: "#df4b26",
          strokeWidth: 5,
          tension: 0.5,
          lineCap: "round",
          lineJoin: "round",
          globalCompositeOperation: "source-over",
        },
        className: "Line",
      },
      {
        attrs: {
          points: [
            449.00292936323524, 164.7416344661691, 456.00297503259526, 161.7416182090534, 463.0030207019553, 157.74159653289914, 474.0030924680924,
            149.7415531805906, 482.00314466164673, 144.7415260853978, 494.00322295197816, 139.74149899020495, 499.0032555729496, 135.74147731405068,
            512.0033403874753, 131.74145563789642, 526.0034317261953, 129.7414447998193, 542.003536113304, 127.74143396174216, 556.003627452024,
            124.74141770462647, 569.0037122665498, 121.74140144751077, 582.0037970810755, 118.74138519039508, 594.0038753714069, 115.74136893327938,
            605.0039471375442, 110.74134183808656, 614.0040058552927, 110.74134183808656, 622.004058048847, 106.74132016193228, 631.0041167665956,
            104.74130932385515, 636.004149387567, 101.74129306673946, 637.0041559117614, 100.74128764770089, 640.0041754843442, 99.74128222866233,
            641.0041820085385, 98.74127680962376, 641.0041820085385, 97.7412713905852, 641.0041820085385, 96.74126597154662, 641.0041820085385,
            95.74126055250807, 641.0041820085385, 94.7412551334695, 641.0041820085385, 93.74124971443094, 641.0041820085385, 92.74124429539236,
            640.0041754843442, 92.74124429539236, 637.0041559117614, 90.74123345731523, 633.0041298149841, 90.74123345731523, 628.0040971940127,
            89.74122803827667, 622.004058048847, 87.74121720019954, 614.0040058552927, 87.74121720019954, 603.0039340891556, 83.74119552404528,
            588.0038362262412, 79.74117384789102, 574.0037448875212, 75.74115217173676, 560.0036535488011, 70.74112507654392, 546.0035622100811,
            67.74110881942822, 527.0034382503896, 61.741076305196835, 511.00333386328106, 58.74106004808114, 497.003242524561, 52.74102753384974,
            478.00311856486957, 47.74100043865691, 464.0030272261495, 43.74097876250265, 452.0029489358181, 39.74095708634839, 442.0028836938752,
            37.74094624827126, 432.00281845193234, 33.740924572116995, 423.00275973418377, 32.74091915307843, 417.002720589018, 30.7409083150013,
            411.0026814438523, 29.740902895962734, 407.0026553470751, 28.740897476924168, 402.0026227261037, 28.740897476924168, 399.00260315352085,
            28.740897476924168, 397.00259010513224, 28.740897476924168, 394.0025705325494, 28.740897476924168, 392.00255748416083, 28.740897476924168,
            391.0025509599665, 28.740897476924168, 390.0025444357722, 28.740897476924168, 388.00253138738367, 28.740897476924168, 388.00253138738367,
            28.740897476924168, 387.00252486318936, 28.740897476924168,
          ],
          stroke: "#df4b26",
          strokeWidth: 5,
          tension: 0.5,
          lineCap: "round",
          lineJoin: "round",
          globalCompositeOperation: "destination-out",
        },
        className: "Line",
      },
    ]);
  };

  socket.on("whiteboard:render", (newLine: TLineD) => {
    console.log("received render order");
    setStageContent((prev) => [...prev, newLine]);
  });

  return (
    <>
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <button onClick={handleStageSave}>Save stage</button>
        <button onClick={handleStageLoad}>Load stage</button>
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}>
        <Layer>
          {stageContent &&
            stageContent.map((line, j) => (
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
      <div style={{ position: "absolute", top: 20, right: 20, textAlign: "right" }}>
        <p>Visibility: {visibility}</p>
        <p>Tool: {toolSettings.tool}</p>
        <p>Size: {toolSettings.size}</p>
        <p>Size: {toolSettings.color}</p>
      </div>
    </>
  );
}

export default Whiteboard;
