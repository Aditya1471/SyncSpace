import React from "react";
import "./Toolbar.css";

function ToolbarButton({
  id,
  name,
  icon,
  isActive = false,
  onClick,
  disabled = false,
  className = "",
  title,
}) {
  return (
    <button
      id={`tool-${id}`}
      className={`toolbar-btn ${isActive ? "active" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title || name}
      aria-label={name}
    >
      <span className="btn-icon">{icon}</span>
      <span className="tooltip">{name}</span>
    </button>
  );
}

export default ToolbarButton;
