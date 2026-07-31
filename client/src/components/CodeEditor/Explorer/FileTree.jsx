import React from "react";
import FolderItem from "./FolderItem";
import FileItem from "./FileItem";

export default function FileTree({ items }) {
  return (
    <>
      {items.map((item) =>
        item.type === "folder" ? (
          <FolderItem
            key={item.id}
            folder={item}
          />
        ) : (
          <FileItem
            key={item.id}
            file={item}
          />
        )
      )}
    </>
  );
}