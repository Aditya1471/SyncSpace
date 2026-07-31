import React, { useState } from "react";
import {
  FaCodeBranch,
  FaPlus,
  FaCheck,
  FaUpload,
  FaSyncAlt,
  FaFileAlt,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

import "./Git.css";

export default function GitPanel() {
  const [message, setMessage] = useState("");

  const [expanded, setExpanded] = useState(true);

  const changes = [
    {
      name: "App.jsx",
      status: "Modified",
      type: "M",
    },
    {
      name: "Navbar.jsx",
      status: "Added",
      type: "A",
    },
    {
      name: "Editor.css",
      status: "Deleted",
      type: "D",
    },
  ];

  return (
    <div className="git-panel">

      {/* Header */}

      <div className="git-header">
        <FaCodeBranch />
        <span>SOURCE CONTROL</span>
      </div>

      {/* Commit Message */}

      <div className="commit-box">

        <textarea
          placeholder="Commit message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

      </div>

      {/* Action Buttons */}

      <div className="git-actions">

        <button>
          <FaCheck />
          Commit
        </button>

        <button>
          <FaUpload />
          Push
        </button>

        <button>
          <FaSyncAlt />
          Pull
        </button>

      </div>

      {/* Changes */}

      <div className="changes-header">

        <div
          className="changes-title"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <FaChevronDown />
          ) : (
            <FaChevronRight />
          )}

          <span>Changes ({changes.length})</span>

        </div>

        <button className="stage-all">
          <FaPlus />
        </button>

      </div>

      {expanded && (

        <div className="changes-list">

          {changes.map((file, index) => (

            <div
              key={index}
              className="change-item"
            >

              <div className="change-left">

                <FaFileAlt />

                <span>{file.name}</span>

              </div>

              <div className={`change-type ${file.type}`}>
                {file.type}
              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}