import React, { useState, useRef } from "react";
import { Stage, Layer, Line } from "react-konva";

function Whiteboard() {
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      points: [pos.x, pos.y],
    };
    setLines((prevLines) => [...prevLines, newLine]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setLines((prevLines) => {
      if (prevLines.length === 0) return prevLines;
      const lastLine = prevLines[prevLines.length - 1];
      const updatedLastLine = {
        ...lastLine,
        points: [...lastLine.points, point.x, point.y],
      };
      return [...prevLines.slice(0, -1), updatedLastLine];
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      style={{
        border: "2px solid black",
        background: "#ffffff",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        {lines.map((line) => (
          <Line
            key={line.id}
            points={line.points}
            stroke="#000000"
            strokeWidth={3}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        ))}
      </Layer>
    </Stage>
  );
}

export default Whiteboard;