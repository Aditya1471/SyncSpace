import {
  ChevronRight,
  Folder,
  FileCode,
  Home,
} from "lucide-react";

import "./Breadcrumb.css";

export default function Breadcrumb({
  path = [
    "SyncSpace",
    "src",
    "components",
    "CodeEditor",
    "Editor",
    "MonacoEditor.jsx",
  ],
  onNavigate = () => {},
}) {
  return (
    <nav className="breadcrumb">

      {/* Workspace Root */}
      <div
        className="breadcrumb-home"
        onClick={() => onNavigate(0)}
      >
        <Home size={15} />
      </div>

      {path.map((item, index) => {

        const isLast = index === path.length - 1;
        const isFile = item.includes(".");

        return (
          <div
            key={index}
            className="breadcrumb-wrapper"
          >

            <ChevronRight
              size={14}
              className="breadcrumb-separator"
            />

            <button
              className={`breadcrumb-item ${
                isLast ? "active" : ""
              }`}
              onClick={() => onNavigate(index)}
            >

              <span className="breadcrumb-icon">
                {isFile ? (
                  <FileCode size={15} />
                ) : (
                  <Folder size={15} />
                )}
              </span>

              <span className="breadcrumb-text">
                {item}
              </span>

              {isLast && (
                <span className="breadcrumb-dot"></span>
              )}

            </button>

          </div>
        );
      })}
    </nav>
  );
}