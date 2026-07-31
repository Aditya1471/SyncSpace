import React, { useState } from "react";

export default function TerminalInput({ onExecute }) {
  const [command, setCommand] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onExecute(command);
      setCommand("");
    }
  };

  return (
    <div className="terminal-input">

      <span className="terminal-prompt">$</span>

      <input
        type="text"
        placeholder="Enter command..."
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={handleKeyDown}
      />

    </div>
  );
}