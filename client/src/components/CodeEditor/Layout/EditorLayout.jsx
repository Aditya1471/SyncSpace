import React from "react";
import {
  FaReact,
  FaCode,
  FaTimes,
} from "react-icons/fa";

import "./EditorLayout.css";


export default function EditorLayout() {

  return (

    <main className="editor-layout">


      {/* Editor Tabs */}
      <div className="editor-tabs">


        <div className="tab active">

          <FaReact className="tab-icon" />

          <span>
            App.jsx
          </span>

          <FaTimes className="close-icon"/>

        </div>


        <div className="tab">

          <FaCode className="tab-icon"/>

          <span>
            index.js
          </span>

          <FaTimes className="close-icon"/>

        </div>


      </div>



      {/* Editor Content */}
      <div className="editor-content">


        <div className="welcome-container">


          <h1>
            <span>
              Sync
            </span>
            Space
          </h1>


          <p>
            Real-Time Collaborative Code Editor
          </p>



          <div className="shortcuts">


            <div>
              <strong>
                Ctrl + P
              </strong>
              <span>
                Quick Open
              </span>
            </div>


            <div>
              <strong>
                Ctrl + S
              </strong>
              <span>
                Save File
              </span>
            </div>


            <div>
              <strong>
                Ctrl + `
              </strong>
              <span>
                Open Terminal
              </span>
            </div>


          </div>


        </div>


      </div>


    </main>

  );

}