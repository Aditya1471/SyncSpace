import React, { useState } from "react";
import {
  FaRegFileCode,
  FaSearch,
  FaCodeBranch,
  FaBug,
  FaPuzzlePiece,
  FaCog,
  FaCode,
} from "react-icons/fa";

import "./ActivityBar.css";

export default function ActivityBar() {
  const [active, setActive] = useState("explorer");

  const topItems = [
    {
      id: "explorer",
      icon: <FaRegFileCode />,
      title: "Explorer",
    },
    {
      id: "search",
      icon: <FaSearch />,
      title: "Search",
    },
    {
      id: "git",
      icon: <FaCodeBranch />,
      title: "Source Control",
      badge: 2,
    },
    {
      id: "debug",
      icon: <FaBug />,
      title: "Run & Debug",
    },
    {
      id: "extensions",
      icon: <FaPuzzlePiece />,
      title: "Extensions",
    },
  ];

  return (
    <aside className="activity-bar">

      {/* Logo */}
      <div className="activity-logo">
        <FaCode />
      </div>

      {/* Top Icons */}
      <div className="activity-top">
        {topItems.map((item) => (
          <button
            key={item.id}
            className={`activity-button ${
              active === item.id ? "active" : ""
            }`}
            onClick={() => setActive(item.id)}
          >
            {active === item.id && (
              <span className="activity-indicator" />
            )}

            <span className="activity-icon">
              {item.icon}
            </span>

            {item.badge && (
              <span className="activity-badge">
                {item.badge}
              </span>
            )}

            <span className="activity-tooltip">
              {item.title}
            </span>
          </button>
        ))}
      </div>

      {/* Bottom */}
      <div className="activity-bottom">
        <button
          className="activity-button"
        >
          <span className="activity-icon">
            <FaCog />
          </span>

          <span className="activity-tooltip">
            Settings
          </span>
        </button>
      </div>

    </aside>
  );
}