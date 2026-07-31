import React from "react";

export default function ContextMenu({
  x,
  y,
  visible,
}) {
  if (!visible) return null;

  return (
    <div
      className="context-menu"
      style={{
        top: y,
        left: x,
      }}
    >

      <div>New File</div>

      <div>New Folder</div>

      <div>Rename</div>

      <div>Delete</div>

      <div>Copy Path</div>

    </div>
  );
}