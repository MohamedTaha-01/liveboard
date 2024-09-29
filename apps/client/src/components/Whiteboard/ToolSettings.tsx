import { useContext } from "react";
import { ToolSettingsContext } from "../../context/ToolSettingsProvider";

function ToolSettings() {
  const toolSettings = useContext(ToolSettingsContext);

  return (
    <section style={{ position: "absolute", top: 40, left: 0 }}>
      <p>Tool</p>
      <select
        value={toolSettings.tool}
        onChange={(e) => {
          toolSettings.changeTool(e.target.value);
        }}>
        <option value="pen">Pen</option>
        <option value="eraser">Eraser</option>
      </select>
      <select
        value={toolSettings.size}
        onChange={(e) => {
          toolSettings.changeSize(e.target.value);
        }}>
        <option value={2}>2</option>
        <option value={5}>5</option>
        <option value={8}>8</option>
        <option value={12}>12</option>
        <option value={16}>16</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <input type="color" value={toolSettings.color} onChange={(e) => toolSettings.changeColor(e.target.value)}></input>
    </section>
  );
}

export default ToolSettings;
