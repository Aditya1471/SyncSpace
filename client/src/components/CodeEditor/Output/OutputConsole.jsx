import { useEffect, useRef, useState } from "react";
import {
  Trash2,
  Copy,
  Download,
  Terminal,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react";

import "./Output.css";

const initialLogs = [
  {
    id: 1,
    type: "info",
    message: "SyncSpace Editor Started",
    time: new Date().toLocaleTimeString(),
  },
];

export default function OutputConsole() {
  const [logs, setLogs] = useState(initialLogs);

  const [channel, setChannel] = useState("Output");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [logs]);

  const addLog = (type, message) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        type,
        message,
        time: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const copyLogs = async () => {
    const text = logs
      .map((log) => `[${log.time}] ${log.message}`)
      .join("\n");

    await navigator.clipboard.writeText(text);
  };

  const downloadLogs = () => {
    const blob = new Blob(
      [
        logs
          .map((log) => `[${log.time}] ${log.message}`)
          .join("\n"),
      ],
      { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "output.log";
    a.click();

    URL.revokeObjectURL(url);
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="success" />;

      case "warning":
        return <AlertTriangle size={16} className="warning" />;

      case "error":
        return <XCircle size={16} className="error" />;

      default:
        return <Info size={16} className="info" />;
    }
  };

  return (
    <div className="output-console">

      <div className="output-header">

        <div className="output-left">

          <Terminal size={16} />

          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            <option>Output</option>
            <option>Build</option>
            <option>Run</option>
            <option>Debug</option>
          </select>

        </div>

        <div className="output-actions">

          <button onClick={copyLogs}>
            <Copy size={16} />
          </button>

          <button onClick={downloadLogs}>
            <Download size={16} />
          </button>

          <button onClick={clearLogs}>
            <Trash2 size={16} />
          </button>

        </div>

      </div>

      <div className="output-body">

        {logs.map((log) => (
          <div
            className="output-line"
            key={log.id}
          >
            {getIcon(log.type)}

            <span className="output-time">
              [{log.time}]
            </span>

            <span className="output-message">
              {log.message}
            </span>
          </div>
        ))}

        <div ref={bottomRef} />

      </div>

      {/* Demo Buttons - remove after backend integration */}

      <div className="output-demo">

        <button
          onClick={() =>
            addLog("success", "Compilation Successful")
          }
        >
          Success
        </button>

        <button
          onClick={() =>
            addLog("warning", "Unused Variable")
          }
        >
          Warning
        </button>

        <button
          onClick={() =>
            addLog("error", "Compilation Failed")
          }
        >
          Error
        </button>

      </div>

    </div>
  );
}