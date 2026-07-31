import React, { useState } from "react";
import {
  FaChevronRight,
  FaChevronDown,
  FaFolder,
  FaFolderOpen,
} from "react-icons/fa";

import FileTree from "./FileTree";

export default function FolderItem({ folder }) {
  const [open, setOpen] = useState(folder.open);

  return (
    <div>

      <div
        className="folder-item"
        onClick={() => setOpen(!open)}
      >

        {open ? (
          <FaChevronDown />
        ) : (
          <FaChevronRight />
        )}

        {open ? (
          <FaFolderOpen color="#dcb67a" />
        ) : (
          <FaFolder color="#dcb67a" />
        )}

        <span>{folder.name}</span>

      </div>

      {open && (
        <div className="folder-children">

          <FileTree items={folder.children} />

        </div>
      )}

    </div>
  );
}