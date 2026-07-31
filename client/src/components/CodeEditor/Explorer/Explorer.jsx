import React from "react";
import FileTree from "./FileTree";
import "./Explorer.css";

export default function Explorer() {
  const data = [
    {
      id: 1,
      type: "folder",
      name: "src",
      open: true,
      children: [
        {
          id: 2,
          type: "folder",
          name: "components",
          open: true,
          children: [
            {
              id: 3,
              type: "file",
              name: "Navbar.jsx",
            },
            {
              id: 4,
              type: "file",
              name: "Hero.jsx",
            },
          ],
        },
        {
          id: 5,
          type: "file",
          name: "App.jsx",
        },
        {
          id: 6,
          type: "file",
          name: "main.jsx",
        },
      ],
    },
    {
      id: 7,
      type: "file",
      name: "package.json",
    },
  ];

  return (
    <div className="explorer">

      <div className="explorer-header">
        EXPLORER
      </div>

      <FileTree items={data} />

    </div>
  );
}