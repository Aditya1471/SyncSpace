import { useState } from "react";
import { Minimize2, Maximize2 } from "lucide-react";
import "./Minimap.css";

export default function Minimap({
  enabled = true,
  onToggle = () => {},
}) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  const handleToggle = () => {
    const value = !isEnabled;
    setIsEnabled(value);
    onToggle(value);
  };

  return (
    <div className="minimap-panel">
      <div className="minimap-header">
        <span>Minimap</span>

        <button
          className="minimap-toggle"
          onClick={handleToggle}
        >
          {isEnabled ? (
            <>
              <Minimize2 size={15} />
              Hide
            </>
          ) : (
            <>
              <Maximize2 size={15} />
              Show
            </>
          )}
        </button>
      </div>

      <div className="minimap-preview">
        {isEnabled ? (
          <div className="preview-lines">
            {Array.from({ length: 80 }).map((_, index) => (
              <div
                key={index}
                className="preview-line"
                style={{
                  width: `${55 + Math.random() * 45}%`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="minimap-disabled">
            Minimap Disabled
          </div>
        )}
      </div>
    </div>
  );
}