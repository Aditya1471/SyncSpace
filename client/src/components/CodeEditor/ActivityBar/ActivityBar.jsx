import React, { useState } from "react";
import {
  FaRegFileCode,
  FaSearch,
  FaCodeBranch,
  FaPlay,
  FaPuzzlePiece,
  FaCog,
  FaBolt,
  FaBell,
} from "react-icons/fa";

import ActivityButton from "./ActivityButton";
import "./ActivityBar.css";

export default function ActivityBar() {
  const [active, setActive] = useState("explorer");

  const activities = [
    {
      id: "explorer",
      icon: <FaRegFileCode />,
      title: "Explorer",
      badge: null,
    },
    {
      id: "search",
      icon: <FaSearch />,
      title: "Search",
      badge: null,
    },
    {
      id: "git",
      icon: <FaCodeBranch />,
      title: "Source Control",
      badge: 2,
    },
    {
      id: "run",
      icon: <FaPlay />,
      title: "Run & Debug",
      badge: null,
    },
    {
      id: "extensions",
      icon: <FaPuzzlePiece />,
      title: "Extensions",
      badge: 6,
    },
  ];

  return (
    <aside className="activity-bar">

      {/* ================================= */}
      {/* LOGO */}
      {/* ================================= */}

      <div className="activity-logo">

        <div className="logo-circle">
          <FaBolt />
        </div>

        <span className="logo-tooltip">
          SyncSpace IDE
        </span>

      </div>

      {/* ================================= */}
      {/* MAIN ICONS */}
      {/* ================================= */}

      <div className="activity-top">

        {activities.map((item) => (

          <div
            key={item.id}
            className="activity-wrapper"
          >

            <ActivityButton
              icon={item.icon}
              title={item.title}
              active={active === item.id}
              onClick={() => setActive(item.id)}
            />

            {item.badge && (
              <span className="activity-badge">
                {item.badge}
              </span>
            )}

          </div>

        ))}

      </div>

      {/* ================================= */}
      {/* BOTTOM */}
      {/* ================================= */}

      <div className="activity-bottom">

        <ActivityButton
          icon={<FaBell />}
          title="Notifications"
          active={false}
          onClick={() => {}}
        />

        <ActivityButton
          icon={<FaCog />}
          title="Settings"
          active={false}
          onClick={() => {}}
        />

      </div>

    </aside>
  );
}