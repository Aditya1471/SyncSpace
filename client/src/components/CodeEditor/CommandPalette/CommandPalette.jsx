import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Terminal,
  Play,
  Moon,
  Sun,
  FolderOpen,
  FileCode,
  Settings,
  Palette,
  X
} from "lucide-react";

import "./CommandPalette.css";

const COMMANDS = [
  {
    id: 1,
    title: "Run Code",
    icon: Play,
    category: "Execution",
  },
  {
    id: 2,
    title: "Open File",
    icon: FolderOpen,
    category: "File",
  },
  {
    id: 3,
    title: "Toggle Terminal",
    icon: Terminal,
    category: "View",
  },
  {
    id: 4,
    title: "Toggle Theme",
    icon: Moon,
    category: "Appearance",
  },
  {
    id: 5,
    title: "Open Settings",
    icon: Settings,
    category: "Preferences",
  },
  {
    id: 6,
    title: "Change Language",
    icon: FileCode,
    category: "Editor",
  },
  {
    id: 7,
    title: "Color Theme",
    icon: Palette,
    category: "Appearance",
  },
  {
    id: 8,
    title: "Light Theme",
    icon: Sun,
    category: "Appearance",
  },
];

export default function CommandPalette({
  open,
  onClose,
  onCommand = () => {},
}) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    return COMMANDS.filter(command =>
      command.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="palette-overlay">

      <div className="palette">

        <div className="palette-search">

          <Search size={18} />

          <input
            autoFocus
            placeholder="Type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button onClick={onClose}>
            <X size={16} />
          </button>

        </div>

        <div className="palette-results">

          {filtered.length === 0 && (
            <div className="palette-empty">
              No matching commands
            </div>
          )}

          {filtered.map(command => {

            const Icon = command.icon;

            return (

              <div
                key={command.id}
                className="palette-item"
                onClick={() => {
                  onCommand(command);
                  onClose();
                }}
              >

                <div className="palette-left">

                  <Icon size={18} />

                  <div>

                    <div className="palette-title">
                      {command.title}
                    </div>

                    <div className="palette-category">
                      {command.category}
                    </div>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}