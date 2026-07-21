import React, { useState, useRef, useEffect } from "react";
import "./Toolbar.css";

const STROKE_OPTIONS = [
  { value: 2, label: "Thin (2px)" },
  { value: 4, label: "Medium (4px)" },
  { value: 8, label: "Thick (8px)" },
  { value: 12, label: "Extra Thick (12px)" },
];

function StrokeSelector({ value, onChange }) {
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

  const handleSelectOption = (widthValue) => {
    onChange(widthValue);
    setIsOpen(false);
  };

  const currentOption =
    STROKE_OPTIONS.find((opt) => opt.value === value) || STROKE_OPTIONS[0];

  return (
    <div className="stroke-selector-container" ref={containerRef}>
      <button
        className="stroke-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Stroke Width"
        aria-label="Stroke Width"
      >
        <span className="stroke-preview-circle-wrapper">
          <span
            className="stroke-preview-circle"
            style={{ width: `${Math.min(value + 2, 14)}px`, height: `${Math.min(value + 2, 14)}px` }}
          />
        </span>
        <span className="stroke-value-label">{currentOption.label}</span>
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
        <div className="stroke-selector-dropdown">
          <div className="dropdown-header">Stroke Width</div>
          <div className="stroke-options-list">
            {STROKE_OPTIONS.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  className={`stroke-option-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelectOption(option.value)}
                  title={option.label}
                  aria-label={option.label}
                >
                  <div className="stroke-option-preview-line-container">
                    <div
                      className="stroke-option-preview-line"
                      style={{ height: `${option.value}px` }}
                    />
                  </div>
                  <span className="stroke-option-label">{option.label}</span>
                  {isSelected && (
                    <svg
                      className="stroke-option-check"
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      stroke="currentColor"
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

export default StrokeSelector;
