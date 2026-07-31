import React, { useState } from "react";
import TerminalOutput from "./TerminalOutput";
import TerminalInput from "./TerminalInput";
import "./Terminal.css";

export default function Terminal() {
  const [history, setHistory] = useState([
    {
      type: "system",
      text: "Welcome to CodeStudio Terminal",
    },
    {
      type: "system",
      text: "Type a command below...",
    },
  ]);

  const executeCommand = (command) => {
    if (!command.trim()) return;

    setHistory((prev) => [
      ...prev,
      {
        type: "command",
        text: command,
      },
      {
        type: "output",
        text: "Backend execution will be connected later.",
      },
    ]);
  };

  return (
    <div className="terminal">

      <div className="terminal-header">
        TERMINAL
      </div>

      <TerminalOutput history={history} />

      <TerminalInput onExecute={executeCommand} />

    </div>
  );
}