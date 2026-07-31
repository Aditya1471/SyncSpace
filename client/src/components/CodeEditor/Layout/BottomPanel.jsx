import React, { useState } from "react";
import {
  FaTerminal,
  FaTimes,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import "./BottomPanel.css";

export default function BottomPanel() {

  const [open, setOpen] = useState(true);

  return (
    <div className={`bottom-panel ${open ? "open" : "closed"}`}>

      {/* Header */}
      <div className="panel-header">

        <div className="panel-title">
          <FaTerminal />
          <span>TERMINAL</span>
        </div>


        <div className="panel-actions">

          <button
            title="Toggle Panel"
            onClick={() => setOpen(!open)}
          >
            {
              open 
              ? <FaChevronDown />
              : <FaChevronUp />
            }
          </button>


          <button title="Close Panel">
            <FaTimes />
          </button>

        </div>

      </div>


      {/* Terminal Body */}
      {
        open && (
          <div className="panel-body">

            <div className="terminal-line">
              <span className="prompt">
                $
              </span>

              <span>
                npm run dev
              </span>
            </div>


            <div className="terminal-output">

              Welcome to SyncSpace Terminal
              <br/>
              Ready for commands...

            </div>


            <div className="terminal-input">

              <span>
                $
              </span>

              <input
                type="text"
                placeholder="Type a command..."
              />

            </div>


          </div>
        )
      }

    </div>
  );
}