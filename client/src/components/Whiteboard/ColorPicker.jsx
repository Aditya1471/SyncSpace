import React, { useState, useRef, useEffect } from "react";
import "./Toolbar.css";

const PALETTE = [
  { hex: "transparent", name: "None" },
  { hex: "#1e293b", name: "Ink" },
  { hex: "#64748b", name: "Slate" },
  { hex: "#ef4444", name: "Red" },
  { hex: "#f97316", name: "Orange" },
  { hex: "#eab308", name: "Yellow" },
  { hex: "#22c55e", name: "Green" },
  { hex: "#3b82f6", name: "Blue" },
  { hex: "#8b5cf6", name: "Purple" },
  { hex: "#ec4899", name: "Pink" },
];

function ColorPicker({ label, value, onChange, showTransparent = true, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectColor = (colorHex) => {
    onChange(colorHex);
    setIsOpen(false);
  };

  const isTransparent = value === "transparent";

  return (
    <div className="color-picker-container" ref={containerRef}>
      <button
        className={`color-picker-trigger ${disabled ? "disabled" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        title={label}
        aria-label={label}
      >
        <span className="color-picker-preview-wrapper">
          {isTransparent ? (
            <span className="color-preview-transparent" />
          ) : (
            <span
              className="color-preview"
              style={{ backgroundColor: value }}
            />
          )}
        </span>
        <span className="color-picker-label">{label}</span>
        <svg
          className={`chevron-icon ${isOpen ? "open" : ""}`}
          viewBox="0 0 24 24"
          width="12"
          height="12"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="color-picker-dropdown">
          <div className="dropdown-header">{label}</div>
          <div className="color-grid">
            {PALETTE.map((color) => {
              if (color.hex === "transparent" && !showTransparent) return null;
              const isSelected = value === color.hex;
              return (
                <button
                  key={color.hex}
                  className={`color-swatch ${isSelected ? "selected" : ""}`}
                  style={{
                    backgroundColor: color.hex === "transparent" ? "transparent" : color.hex,
                  }}
                  onClick={() => handleSelectColor(color.hex)}
                  title={color.name}
                  aria-label={color.name}
                >
                  {color.hex === "transparent" && (
                    <span className="swatch-transparent-line" />
                  )}
                  {isSelected && (
                    <svg
                      className="swatch-check"
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      stroke={
                        color.hex === "transparent" || color.hex === "#eab308"
                          ? "#1e293b"
                          : "#ffffff"
                      }
                      strokeWidth="3"
                      fill="none"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
