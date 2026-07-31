import React from "react";

export default function TerminalOutput({ history }) {
  return (
    <div className="terminal-output">

      {history.map((item, index) => (
        <div
          key={index}
          className={`terminal-line ${item.type}`}
        >
          {item.type === "command" && (
            <span className="terminal-prefix">$ </span>
          )}

          {item.text}
        </div>
      ))}

    </div>
  );
}