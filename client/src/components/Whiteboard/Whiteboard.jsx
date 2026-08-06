import React, { useState, useRef, useEffect, useCallback } from "react";
import { Stage, Layer, Line, Rect, Ellipse, Arrow, Transformer } from "react-konva";
import Toolbar from "./Toolbar";
import "./Whiteboard.css";

// Cycle array to support future theme scalability
const THEMES = ["dark", "light"];

// Helper to determine distance from point p to line segment ab
const getDistanceToSegment = (p, a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) {
    const dpx = p.x - a.x;
    const dpy = p.y - a.y;
    return Math.sqrt(dpx * dpx + dpy * dpy);
  }
  let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = a.x + t * dx;
  const projY = a.y + t * dy;
  const dpx = p.x - projX;
  const dpy = p.y - projY;
  return Math.sqrt(dpx * dpx + dpy * dpy);
};

// Check if a point intersects a drawn line segment within a threshold
const lineIntersectsPoint = (p, line, threshold = 14) => {
  const points = line.points;
  if (!points || points.length < 2) return false;

  const actualThreshold = threshold + (line.strokeWidth || 3) / 2;

  // Handle single dot/point clicks
  if (points.length === 2) {
    const a = { x: points[0], y: points[1] };
    const dx = p.x - a.x;
    const dy = p.y - a.y;
    return Math.sqrt(dx * dx + dy * dy) <= actualThreshold;
  }

  // Iterate over line segments
  for (let i = 0; i < points.length - 2; i += 2) {
    const a = { x: points[i], y: points[i + 1] };
    const b = { x: points[i + 2], y: points[i + 3] };
    if (getDistanceToSegment(p, a, b) <= actualThreshold) {
      return true;
    }
  }
  return false;
};

// Map low-contrast colors dynamically so they remain visible on theme switches
const getAdaptiveColor = (color, currentTheme) => {
  if (color === "transparent" || !color) return "transparent";

  if (currentTheme === "dark") {
    // Ink color (#1e293b) or black is mapped to off-white (#f8fafc) in dark mode
    if (color === "#1e293b" || color === "#000000" || color === "#111827") {
      return "#f8fafc";
    }
  } else {
    // Off-white/white colors are mapped to Ink (#1e293b) in light mode
    if (color === "#f8fafc" || color === "#ffffff" || color === "#f9fafb") {
      return "#1e293b";
    }
  }
  return color;
};

// Map transparent fills to a hit-detectable transparent color for canvas interactions
const getAdaptiveFill = (color, currentTheme) => {
  if (color === "transparent" || !color) return "rgba(0,0,0,0)";
  return getAdaptiveColor(color, currentTheme);
};

// Normalize drawn shape boundaries so that top-left is always positive coordinates
const normalizeShape = (shape) => {
  let { x, y, width, height } = shape;
  if (width < 0) {
    x = x + width;
    width = Math.abs(width);
  }
  if (height < 0) {
    y = y + height;
    height = Math.abs(height);
  }
  return { ...shape, x, y, width, height };
};

// General hit detection for vector shapes and freehand paths
const elementIntersectsPoint = (p, element) => {
  if (element.tool === "pencil" || element.tool === "brush") {
    return lineIntersectsPoint(p, element, 14);
  }

  const { type, x, y, width, height, strokeWidth } = element;
  const threshold = 14 + (strokeWidth || 4) / 2;

  if (type === "rectangle" || type === "diamond" || type === "triangle" || type === "hexagon" || type === "star") {
    const minX = Math.min(x, x + width);
    const maxX = Math.max(x, x + width);
    const minY = Math.min(y, y + height);
    const maxY = Math.max(y, y + height);
    
    // Check if within bounds
    const isInside = p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY;
    if (isInside) return true;

    // Check boundary proximity
    const nearLeft = Math.abs(p.x - minX) <= threshold && p.y >= minY - threshold && p.y <= maxY + threshold;
    const nearRight = Math.abs(p.x - maxX) <= threshold && p.y >= minY - threshold && p.y <= maxY + threshold;
    const nearTop = Math.abs(p.y - minY) <= threshold && p.x >= minX - threshold && p.x <= maxX + threshold;
    const nearBottom = Math.abs(p.y - maxY) <= threshold && p.x >= minX - threshold && p.x <= maxX + threshold;
    
    return nearLeft || nearRight || nearTop || nearBottom;
  }

  if (type === "circle") {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const rx = Math.abs(width) / 2;
    const ry = Math.abs(height) / 2;

    if (rx === 0 || ry === 0) return false;

    const dx = p.x - cx;
    const dy = p.y - cy;
    
    // Ellipse formula check
    const dist = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
    if (dist <= 1.0) return true;

    const outerDist = (dx * dx) / ((rx + threshold) * (rx + threshold)) + (dy * dy) / ((ry + threshold) * (ry + threshold));
    return outerDist <= 1.0;
  }


  if (type === "line" || type === "arrow") {
    const a = { x, y };
    const b = { x: x + width, y: y + height };
    return getDistanceToSegment(p, a, b) <= threshold;
  }

  return false;
};

function Whiteboard({ socket, roomId }) {
  // Elements state
  const [lines, setLines] = useState([]);
  const isIncomingUpdate = useRef(false);

  // Listen for remote draw updates
  useEffect(() => {
    if (!socket) return;

    socket.on("canvas-draw", (data) => {
      isIncomingUpdate.current = true;
      setLines(data);
    });

    socket.on("canvas-clear", () => {
      isIncomingUpdate.current = true;
      setLines([]);
    });

    return () => {
      socket.off("canvas-draw");
      socket.off("canvas-clear");
    };
  }, [socket]);

  // Emit local changes to room
  useEffect(() => {
    if (!socket || !roomId) return;

    if (isIncomingUpdate.current) {
      isIncomingUpdate.current = false;
      return;
    }

    socket.emit("canvas-draw", { roomId, drawData: lines });
  }, [lines, socket, roomId]);
  
  // Selection state
  const [selectedId, setSelectedId] = useState(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs for Konva nodes
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const containerRef = useRef(null);
  const whiteboardRef = useRef(null);


  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Theme state: defaults to dark
  const [theme, setTheme] = useState("dark");

  // Active Tool and Style states
  const [selectedTool, setSelectedTool] = useState("pencil");
  const [selectedShape, setSelectedShape] = useState("rectangle");

  // Future architecture shape factory
  const shapeFactory = useRef({
    createShape: (type, properties) => ({
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      points: [],
      stroke: properties.stroke || "#f8fafc",
      strokeWidth: properties.strokeWidth || 4,
      fill: properties.fill || "transparent",
      ...properties,
    }),
  }).current;



  // Default stroke is light slate/white for dark mode theme
  const [strokeColor, setStrokeColor] = useState("#f8fafc"); 
  const [fillColor, setFillColor] = useState("transparent");
  const [strokeWidth, setStrokeWidth] = useState(4);

  // Infinite canvas position
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const isDrawing = useRef(false);
  const isErasing = useRef(false);
  const hasErasedThisSession = useRef(false);

  // Responsive stage dimensions state
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 600,
  });

  // Handle container resizing to keep the whiteboard stage fully responsive
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.target.clientWidth;
        const height = entry.target.clientHeight;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    if (width > 0 && height > 0) {
      setDimensions({ width, height });
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Listen to browser fullscreen changes to sync toggle state
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  // Reset selection when tool changes
  useEffect(() => {
    if (selectedTool !== "select") {
      setSelectedId(null);
    }
  }, [selectedTool]);

  // Sync selectedId clean-up if selection gets deleted
  useEffect(() => {
    if (selectedId && !lines.some((l) => l.id === selectedId)) {
      setSelectedId(null);
    }
  }, [lines, selectedId]);

  // Helper function to resolve relative mouse coordinates accounting for panning
  const getRelativePointerPosition = (stage) => {
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = stage.getPointerPosition();
    return transform.point(pos);
  };

  // Erase strokes intersecting the pointer coordinates
  const eraseAtPosition = (pos) => {
    // Perform checking synchronously against current state to prevent race conditions
    const toErase = lines.some((line) => elementIntersectsPoint(pos, line));
    if (!toErase) return;

    // Push initial lines state to history exactly once per drag session
    if (!hasErasedThisSession.current) {
      setUndoStack((prev) => [...prev, [...lines]]);
      setRedoStack([]); // Clear redo
      hasErasedThisSession.current = true;
    }

    // Filter out intersected elements in state updater
    setLines((prevLines) => {
      return prevLines.filter((line) => !elementIntersectsPoint(pos, line));
    });
  };

  const handleMouseDown = (e) => {
    const stage = e.target.getStage();
    const relativePos = getRelativePointerPosition(stage);

    // Eraser Mode logic
    if (selectedTool === "eraser") {
      isDrawing.current = false;
      isErasing.current = true;
      hasErasedThisSession.current = false;
      
      eraseAtPosition(relativePos);
      return;
    }


    // Select Mode click-off deselect
    if (selectedTool === "select") {
      if (e.target === stage) {
        setSelectedId(null);
      }
      return;
    }

    // Shape drawing Mode logic
    if (selectedTool === "shape") {
      isDrawing.current = true;
      setUndoStack((prev) => [...prev, [...lines]]);
      setRedoStack([]); // Clear redo

      const isClosed = ["rectangle", "circle", "diamond", "triangle", "hexagon", "star"].includes(selectedShape);
      const newShape = shapeFactory.createShape(selectedShape, {
        x: relativePos.x,
        y: relativePos.y,
        width: 0,
        height: 0,
        stroke: strokeColor,
        fill: isClosed ? fillColor : "transparent",
        strokeWidth: strokeWidth,
      });

      setLines((prevLines) => [...prevLines, newShape]);
      return;
    }

    // Drawing Mode logic (Pencil / Brush)
    if (selectedTool !== "pencil" && selectedTool !== "brush") {
      return;
    }

    isDrawing.current = true;

    // Save previous state to undo stack before drawing
    setUndoStack((prev) => [...prev, [...lines]]);
    setRedoStack([]); // Clear redo

    const newLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tool: selectedTool,
      points: [relativePos.x, relativePos.y],
      stroke: strokeColor,
      strokeWidth: selectedTool === "brush" ? strokeWidth * 2.5 : strokeWidth,
    };

    setLines((prevLines) => [...prevLines, newLine]);
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const relativePos = getRelativePointerPosition(stage);

    // Eraser mouse move
    if (selectedTool === "eraser" && isErasing.current) {
      eraseAtPosition(relativePos);
      return;
    }

    // Drawing mouse move
    if (!isDrawing.current) {
      return;
    }

    // Shape mouse move
    if (selectedTool === "shape") {
      setLines((prevLines) => {
        if (prevLines.length === 0) return prevLines;
        const lastShape = prevLines[prevLines.length - 1];
        if (!lastShape.type) return prevLines; // safety check
        
        const updatedLastShape = {
          ...lastShape,
          width: relativePos.x - lastShape.x,
          height: relativePos.y - lastShape.y,
        };
        return [...prevLines.slice(0, -1), updatedLastShape];
      });
      return;
    }

    // Drawing mouse move (Pencil / Brush)
    if (selectedTool !== "pencil" && selectedTool !== "brush") {
      return;
    }

    setLines((prevLines) => {
      if (prevLines.length === 0) return prevLines;
      const lastLine = prevLines[prevLines.length - 1];
      const updatedLastLine = {
        ...lastLine,
        points: [...lastLine.points, relativePos.x, relativePos.y],
      };
      return [...prevLines.slice(0, -1), updatedLastLine];
    });
  };

  const handleMouseUp = () => {
    if (isErasing.current) {
      isErasing.current = false;
      hasErasedThisSession.current = false;
      return;
    }

    if (isDrawing.current) {
      isDrawing.current = false;
      
      setLines((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        
        // Remove tiny click-created shapes (width & height near 0)
        if (last.type && Math.abs(last.width) < 2 && Math.abs(last.height) < 2) {
          return prev.slice(0, -1);
        }
        
        // Normalize only non-directional shapes
        if (last.type && !["line", "arrow"].includes(last.type)) {
          const normalized = normalizeShape(last);
          return [...prev.slice(0, -1), normalized];
        }
        
        return prev;
      });
    }
  };

  // Theme Toggler
  const handleToggleTheme = () => {
    setTheme((prev) => {
      const nextIdx = (THEMES.indexOf(prev) + 1) % THEMES.length;
      const nextTheme = THEMES[nextIdx];

      // Adapt strokeColor selection for high contrast
      if (nextTheme === "dark" && strokeColor === "#1e293b") {
        setStrokeColor("#f8fafc");
      } else if (nextTheme === "light" && strokeColor === "#f8fafc") {
        setStrokeColor("#1e293b");
      }

      return nextTheme;
    });
  };

  // Undo Action
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, [...lines]]);
    setLines(previous);
  };

  // Redo Action
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, [...lines]]);
    setLines(next);
  };

  // Clear Canvas Action
  const handleClearCanvas = () => {
    if (lines.length > 0) {
      setUndoStack((prev) => [...prev, [...lines]]);
      setRedoStack([]);
      setLines([]);
    }
  };

  // Delete Selection Action
  const handleDelete = useCallback(() => {
    if (!selectedId) return;
    setUndoStack((prev) => [...prev, [...lines]]);
    setRedoStack([]);
    setLines((prev) => prev.filter((line) => line.id !== selectedId));
    setSelectedId(null);
  }, [selectedId, lines]);

  // Fullscreen Toggle Action
  const handleToggleFullscreen = useCallback(() => {
    if (!whiteboardRef.current) return;

    if (!isFullscreen) {
      const element = whiteboardRef.current;
      const requestFullscreen =
        element.requestFullscreen ||
        element.webkitRequestFullscreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullscreen;
      if (requestFullscreen) {
        requestFullscreen.call(element);
      }
    } else {
      const exitFullscreen =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;
      if (exitFullscreen) {
        exitFullscreen.call(document);
      }
    }
  }, [isFullscreen]);


  // Drag Panning event for infinite canvas
  const handleDragStage = (e) => {
    if (e.target === e.target.getStage()) {
      setStagePos({
        x: e.target.x(),
        y: e.target.y(),
      });
    }
  };

  // Selection Dragging Handlers
  const handleDragStart = (e) => {
    e.cancelBubble = true;
    setUndoStack((prev) => [...prev, [...lines]]);
    setRedoStack([]);
  };

  const handleDragEnd = (e) => {
    e.cancelBubble = true;
    const node = e.target;
    const id = node.id();
    
    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id === id) {
          if (line.type === "circle") {
            return {
              ...line,
              x: node.x() - line.width / 2,
              y: node.y() - line.height / 2,
            };
          } else {
            return {
              ...line,
              x: node.x(),
              y: node.y(),
            };
          }
        }
        return line;
      })
    );
  };

  // Selection Resizing Handlers
  const handleTransformStart = () => {
    setUndoStack((prev) => [...prev, [...lines]]);
    setRedoStack([]);
  };

  const handleTransformEnd = (e) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id === selectedId) {
          const type = line.type;
          
          if (type === "circle") {
            const newWidth = node.width() * scaleX;
            const newHeight = node.height() * scaleY;
            return {
              ...line,
              x: node.x() - newWidth / 2,
              y: node.y() - newHeight / 2,
              width: newWidth,
              height: newHeight,
            };
          } else {
            return {
              ...line,
              x: node.x(),
              y: node.y(),
              width: (line.width || 0) * scaleX,
              height: (line.height || 0) * scaleY,
            };
          }
        }
        return line;
      })
    );
  };

  // Key Down Listener for keyboard delete shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedId && (e.key === "Delete" || e.key === "Backspace")) {
        const activeTag = document.activeElement.tagName;
        if (activeTag !== "INPUT" && activeTag !== "TEXTAREA") {
          handleDelete();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, handleDelete]);

  // Bind Transformer dynamically to the active selected shape Konva node
  useEffect(() => {
    if (!transformerRef.current) return;

    if (selectedId && selectedTool === "select") {
      const stage = stageRef.current;
      if (stage) {
        const selectedNode = stage.findOne("#" + selectedId);
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer().batchDraw();
        } else {
          transformerRef.current.nodes([]);
        }
      }
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, selectedTool, lines]);

  // Render element helper maps line array entries to corresponding Konva nodes
  const renderElement = (element) => {
    const stroke = getAdaptiveColor(element.stroke, theme);
    const fill = getAdaptiveFill(element.fill, theme);
    
    // For freehand pencil/brush lines
    if (element.tool === "pencil" || element.tool === "brush") {
      return (
        <Line
          key={element.id}
          id={element.id}
          points={element.points}
          stroke={stroke}
          strokeWidth={element.strokeWidth}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
        />
      );
    }

    // Common props for vector shapes
    const shapeProps = {
      key: element.id,
      id: element.id,
      stroke: stroke,
      strokeWidth: element.strokeWidth,
      draggable: selectedTool === "select",
      onClick: (e) => {
        if (selectedTool === "select") {
          e.cancelBubble = true;
          setSelectedId(element.id);
        }
      },
      onTap: (e) => {
        if (selectedTool === "select") {
          e.cancelBubble = true;
          setSelectedId(element.id);
        }
      },
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onTransformStart: handleTransformStart,
      onTransformEnd: handleTransformEnd,
    };

    switch (element.type) {
      case "rectangle":
        return (
          <Rect
            {...shapeProps}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill={fill}
          />
        );
      case "circle":
        return (
          <Ellipse
            {...shapeProps}
            x={element.x + element.width / 2}
            y={element.y + element.height / 2}
            radiusX={Math.abs(element.width) / 2}
            radiusY={Math.abs(element.height) / 2}
            fill={fill}
          />
        );
      case "line":
        return (
          <Line
            {...shapeProps}
            x={element.x}
            y={element.y}
            points={[0, 0, element.width, element.height]}
            lineCap="round"
            lineJoin="round"
          />
        );
      case "arrow":
        return (
          <Arrow
            {...shapeProps}
            x={element.x}
            y={element.y}
            points={[0, 0, element.width, element.height]}
            fill={stroke}
            pointerLength={10}
            pointerWidth={10}
            lineCap="round"
            lineJoin="round"
          />
        );
      case "diamond": {
        const halfW = element.width / 2;
        const halfH = element.height / 2;
        return (
          <Line
            {...shapeProps}
            x={element.x}
            y={element.y}
            points={[
              halfW, 0,
              element.width, halfH,
              halfW, element.height,
              0, halfH
            ]}
            closed={true}
            fill={fill}
            lineCap="round"
            lineJoin="round"
          />
        );
      }
      case "triangle": {
        return (
          <Line
            {...shapeProps}
            x={element.x}
            y={element.y}
            points={[
              element.width / 2, 0,
              element.width, element.height,
              0, element.height
            ]}
            closed={true}
            fill={fill}
            lineCap="round"
            lineJoin="round"
          />
        );
      }
      case "hexagon": {
        const w = element.width;
        const h = element.height;
        return (
          <Line
            {...shapeProps}
            x={element.x}
            y={element.y}
            points={[
              w * 0.25, 0,
              w * 0.75, 0,
              w, h * 0.5,
              w * 0.75, h,
              w * 0.25, h,
              0, h * 0.5
            ]}
            closed={true}
            fill={fill}
            lineCap="round"
            lineJoin="round"
          />
        );
      }
      case "star": {
        const w = element.width;
        const h = element.height;
        const cx = w / 2;
        const cy = h / 2;
        const rx = w / 2;
        const ry = h / 2;
        const points = [];
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          const r = i % 2 === 0 ? 1 : 0.4;
          points.push(cx + rx * r * Math.cos(angle));
          points.push(cy + ry * r * Math.sin(angle));
        }
        return (
          <Line
            {...shapeProps}
            x={element.x}
            y={element.y}
            points={points}
            closed={true}
            fill={fill}
            lineCap="round"
            lineJoin="round"
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <div ref={whiteboardRef} className={`whiteboard-container theme-${theme}`}>
      <Toolbar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        strokeColor={strokeColor}
        setStrokeColor={setStrokeColor}
        fillColor={fillColor}
        setFillColor={setFillColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearCanvas={handleClearCanvas}
        onDelete={handleDelete}
        hasSelection={!!selectedId}
        canUndo={undoStack.length > 0}
        canRedo={redoStack.length > 0}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Infinite scrolling grid container wrapper */}
      <div
        ref={containerRef}
        className="whiteboard-canvas-container"
        style={{
          backgroundPosition: `${stagePos.x}px ${stagePos.y}px`,
        }}
      >
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          x={stagePos.x}
          y={stagePos.y}
          draggable={selectedTool === "select"}
          onDragMove={handleDragStage}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          style={{
            background: "transparent",
            cursor: selectedTool === "select" ? "default" : "crosshair",
          }}
        >
          <Layer>
            {lines.map((line) => renderElement(line))}
            {selectedTool === "select" && selectedId && (
              <Transformer
                ref={transformerRef}
                rotateEnabled={false}
                borderStroke="#3b82f6"
                borderStrokeWidth={1.5}
                anchorStroke="#3b82f6"
                anchorFill="#ffffff"
                anchorSize={8}
                anchorCornerRadius={2}
                enabledAnchors={[
                  "top-left",
                  "top-center",
                  "top-right",
                  "middle-right",
                  "bottom-right",
                  "bottom-center",
                  "bottom-left",
                  "middle-left",
                ]}
                boundBoxFunc={(oldBox, newBox) => {
                  if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>


      </div>
    </div>
  );
}

export default Whiteboard;