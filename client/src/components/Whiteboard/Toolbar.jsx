import React, { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import ToolbarButton from "./ToolbarButton";
import ColorPicker from "./ColorPicker";
import StrokeSelector from "./StrokeSelector";
import "./Toolbar.css";

// SVG configurations for shape options in dropdown
const SHAPES_LIST = [
  {
    id: "rectangle",
    name: "Rectangle",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    ),
  },
  {
    id: "circle",
    name: "Circle",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    id: "line",
    name: "Line",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="19" x2="19" y2="5" />
      </svg>
    ),
  },
  {
    id: "arrow",
    name: "Arrow",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="19" x2="19" y2="5" />
        <polyline points="13 5 19 5 19 11" />
      </svg>
    ),
  },
  {
    id: "diamond",
    name: "Diamond",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 12l10 10 10-10L12 2z" />
      </svg>
    ),
  },
  {
    id: "triangle",
    name: "Triangle",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3L2 20h20L12 3z" />
      </svg>
    ),
  },
  {
    id: "hexagon",
    name: "Hexagon",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
      </svg>
    ),
  },
  {
    id: "star",
    name: "Star",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

// SVG configurations for tool button groups
const TOOL_GROUPS = [
  {
    id: "selection",
    items: [
      {
        id: "select",
        name: "Select Tool",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            <path d="M13 13l6 6" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "drawing",
    items: [
      {
        id: "pencil",
        name: "Pencil",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        ),
      },
      {
        id: "brush",
        name: "Brush",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m14 6-1-1a3 3 0 0 0-4.2 0L3 10.8V15h4.2l5.8-5.8-1-1" />
            <path d="M16 8l3.5-3.5a2.5 2.5 0 1 1 3.5 3.5L19.5 11.5 16 8z" />
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          </svg>
        ),
      },
      {
        id: "eraser",
        name: "Eraser",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 20H7L3 16c-.5-.5-.5-1.3 0-1.8L13 4c.5-.5 1.3-.5 1.8 0l6 6c.5.5.5 1.3 0 1.8L12.5 20" />
            <path d="M17 14L8 5" />
          </svg>
        ),
      },
      {
        id: "shapes",
        name: "Shapes",
      },
    ],
  },
];

function ShapesDropdown({ selectedTool, setSelectedTool, selectedShape, setSelectedShape }) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Programmatically focus item on keyboard navigation
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].focus();
    }
  }, [focusedIndex, isOpen]);

  // Reset focus index when closing
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  const handleSelectShape = (shapeId) => {
    setSelectedShape(shapeId);
    setSelectedTool("shape");
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % SHAPES_LIST.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + SHAPES_LIST.length) % SHAPES_LIST.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < SHAPES_LIST.length) {
          handleSelectShape(SHAPES_LIST[focusedIndex].id);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const currentShape = SHAPES_LIST.find((s) => s.id === selectedShape) || SHAPES_LIST[0];

  return (
    <div
      className="shapes-dropdown-container"
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <button
        id="tool-shape"
        className={`toolbar-btn shapes-trigger-btn ${selectedTool === "shape" ? "active" : ""}`}
        onClick={() => {
          setIsOpen(!isOpen);
          if (selectedTool !== "shape") {
            setSelectedTool("shape");
          }
        }}
        title={`Shapes (Current: ${currentShape.name})`}
        aria-label="Shapes Menu"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="btn-icon">{currentShape.icon}</span>
        <span className="shapes-label-text">Shapes</span>
        <svg
          className={`chevron-icon ${isOpen ? "open" : ""}`}
          viewBox="0 0 24 24"
          width="10"
          height="10"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="shapes-dropdown" role="listbox">
          {SHAPES_LIST.map((shape, index) => {
            const isSelected = selectedShape === shape.id;
            return (
              <button
                key={shape.id}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`shape-item-btn ${isSelected ? "active" : ""} ${focusedIndex === index ? "keyboard-focused" : ""}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelectShape(shape.id)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <span className="shape-item-icon">{shape.icon}</span>
                <span className="shape-item-name">{shape.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Toolbar({
  selectedTool,
  setSelectedTool,
  selectedShape,
  setSelectedShape,
  strokeColor,
  setStrokeColor,
  fillColor,
  setFillColor,
  strokeWidth,
  setStrokeWidth,
  onUndo,
  onRedo,
  onClearCanvas,
  onDelete,
  hasSelection = false,
  canUndo = false,
  canRedo = false,
  theme = "dark",
  onToggleTheme,
  isFullscreen = false,
  onToggleFullscreen,
}) {
  // Action configurations including dynamic theme switcher
  const actionItems = [
    {
      id: "undo",
      name: "Undo",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      ),
      onClick: onUndo,
      disabled: !canUndo,
    },
    {
      id: "redo",
      name: "Redo",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7" />
        </svg>
      ),
      onClick: onRedo,
      disabled: !canRedo,
    },
    {
      id: "theme",
      name: `Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`,
      icon: theme === "dark" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ),
      onClick: onToggleTheme,
    },
    {
      id: "enter-fullscreen",
      name: "Enter Fullscreen",
      icon: <Maximize2 size={20} />,
      onClick: onToggleFullscreen,
      hidden: isFullscreen,
    },
    {
      id: "exit-fullscreen",
      name: "Exit Fullscreen",
      icon: <Minimize2 size={20} />,
      onClick: onToggleFullscreen,
      hidden: !isFullscreen,
    },
    {
      id: "delete",
      name: "Delete Selected",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
      ),
      onClick: onDelete,
      disabled: !hasSelection,
      className: "toolbar-btn-danger",
    },
    {
      id: "clear",
      name: "Clear Canvas",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      ),
      onClick: onClearCanvas,
      className: "toolbar-btn-danger",
    },
  ];

  const isClosedShape = ["rectangle", "circle", "diamond", "triangle", "hexagon", "star"].includes(selectedShape);
  const isFillEnabled = selectedTool === "shape" && isClosedShape;

  return (
    <div className="whiteboard-toolbar" aria-label="Whiteboard Toolbar">
      {/* Tool Groups: Selection & Drawing */}
      {TOOL_GROUPS.map((group, groupIdx) => (
        <React.Fragment key={group.id}>
          {groupIdx > 0 && <div className="toolbar-separator" />}
          <div className="toolbar-group">
            {group.items.map((tool) => {
              if (tool.id === "shapes") {
                return (
                  <ShapesDropdown
                    key="shapes"
                    selectedTool={selectedTool}
                    setSelectedTool={setSelectedTool}
                    selectedShape={selectedShape}
                    setSelectedShape={setSelectedShape}
                  />
                );
              }
              return (
                <ToolbarButton
                  key={tool.id}
                  id={tool.id}
                  name={tool.name}
                  icon={tool.icon}
                  isActive={selectedTool === tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                />
              );
            })}
          </div>
        </React.Fragment>
      ))}

      {/* Style Group */}
      <div className="toolbar-separator" />
      <div className="toolbar-group">
        <ColorPicker
          label="Stroke"
          value={strokeColor}
          onChange={setStrokeColor}
          showTransparent={false}
        />
        <ColorPicker
          label="Fill"
          value={fillColor}
          onChange={setFillColor}
          showTransparent={true}
          disabled={!isFillEnabled}
        />
        <StrokeSelector value={strokeWidth} onChange={setStrokeWidth} />
      </div>

      {/* Action Group */}
      <div className="toolbar-separator" />
      <div className="toolbar-group">
        {actionItems.filter((action) => !action.hidden).map((action) => (
          <ToolbarButton
            key={action.id}
            id={action.id}
            name={action.name}
            icon={action.icon}
            onClick={action.onClick}
            disabled={action.disabled}
            className={action.className}
          />
        ))}
      </div>
    </div>
  );
}

export default Toolbar;
