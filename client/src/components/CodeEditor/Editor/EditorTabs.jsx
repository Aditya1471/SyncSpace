import React from "react";
import Tab from "./Tab";

export default function EditorTabs({
  files = [],
  activeFile,
  onSelect,
  onClose,
}) {
  return (
    <div className="editor-tabs">

      {files.map((file) => (
        <Tab
          key={file.path}
          file={file}
          active={activeFile === file.path}
          onSelect={() => onSelect(file)}
          onClose={() => onClose(file)}
        />
      ))}

    </div>
  );
}