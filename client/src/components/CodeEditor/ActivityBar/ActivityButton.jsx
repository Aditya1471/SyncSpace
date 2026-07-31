import React from "react";

export default function ActivityButton({
  icon,
  title,
  active,
  badge,
  onClick,
}) {
  return (
    <button
      className={`activity-button ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {/* Active Indicator */}
      {active && (
        <span className="activity-indicator" />
      )}

      {/* Icon */}
      <span className="activity-icon">
        {icon}
      </span>

      {/* Notification Badge */}
      {badge > 0 && (
        <span className="activity-badge">
          {badge > 99 ? "99+" : badge}
        </span>
      )}

      {/* Premium Tooltip */}
      <span className="activity-tooltip">
        {title}
      </span>
    </button>
  );
}