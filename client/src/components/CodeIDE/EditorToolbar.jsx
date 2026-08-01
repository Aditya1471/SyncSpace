import React from "react";

import {
  FaPlay,
  FaSave,
  FaStop,
  FaBug
} from "react-icons/fa";


export default function EditorToolbar({
  run,
  save,
  running = false
}) {


  return (

    <div className="editor-toolbar">


      <div className="toolbar-left">


        <button
          className="run-button"
          onClick={run}
          disabled={running}
        >

          {
            running
            ?
            <FaStop />
            :
            <FaPlay />
          }


          <span>
            {
              running
              ?
              "Running..."
              :
              "Run"
            }
          </span>


        </button>





        <button
          className="debug-button"
        >

          <FaBug />

          <span>
            Debug
          </span>


        </button>



      </div>






      <div className="toolbar-right">


        <button
          className="save-button"
          onClick={save}
        >

          <FaSave />

          <span>
            Save
          </span>


        </button>


      </div>




    </div>

  );

}