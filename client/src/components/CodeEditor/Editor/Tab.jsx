import React from "react";
import { FaReact } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

export default function Tab({
  file,
  active,
  onSelect,
  onClose,
}) {
  return (
    <div
      className={`editor-tab ${active ? "active" : ""}`}
      onClick={onSelect}
    >

      <FaReact className="tab-icon" />

      <span>{file.name}</span>

      <FaTimes
        className="tab-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

    </div>
  );
}