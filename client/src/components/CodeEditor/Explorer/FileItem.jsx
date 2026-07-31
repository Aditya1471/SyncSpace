import React from "react";
import { FaReact } from "react-icons/fa";
import { SiJavascript } from "react-icons/si";

export default function FileItem({ file }) {
  const icon = file.name.endsWith(".jsx")
    ? <FaReact color="#61dafb" />
    : <SiJavascript color="#f7df1e" />;

  return (
    <div className="file-item">

      {icon}

      <span>{file.name}</span>

    </div>
  );
}