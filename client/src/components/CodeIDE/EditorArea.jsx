import React, { useState } from "react";
import MonacoEditor, { loader } from "@monaco-editor/react";
import EditorToolbar from "./EditorToolbar";
import { executeCode } from "../../services/runService";
import { saveFile } from "../../services/editorService";
import "./CodeIDE.css";

loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs"
  }
});

export default function EditorArea({ value, onChange }) {
  const [language, setLanguage] = useState("javascript");
  const [localCode, setLocalCode] = useState(`console.log("SyncSpace IDE");`);

  const code = value !== undefined ? value : localCode;
  const setCode = (val) => {
    if (onChange) {
      onChange(val);
    } else {
      setLocalCode(val);
    }
  };


  const [output, setOutput] =
    useState("");



  const [running, setRunning] =
    useState(false);



  const run = async()=>{


    try{


      setRunning(true);


      const result =
      await executeCode({

        language,

        code

      });



      setOutput(
        result.output ||
        result.error ||
        "No output"
      );


    }
    catch(error){


      setOutput(
        error.message
      );


    }
    finally{


      setRunning(false);


    }


  };





  const save = async()=>{


    try{


      await saveFile({

        code,

        language

      });


      setOutput(
        "File saved successfully"
      );


    }
    catch(error){


      setOutput(
        "Save failed"
      );


    }


  };





  return (


    <section className="editor-area">



      {/* Editor Header */}

      <div className="editor-header">


        <div className="file-tab active">


          App.jsx


        </div>



        <select

          className="language-selector"

          value={language}

          onChange={
            e=>setLanguage(
              e.target.value
            )
          }

        >


          <option value="javascript">
            JavaScript
          </option>


          <option value="python">
            Python
          </option>


          <option value="java">
            Java
          </option>


          <option value="cpp">
            C++
          </option>


          <option value="c">
            C
          </option>


          <option value="typescript">
            TypeScript
          </option>


        </select>


      </div>






      {/* Toolbar */}

      <EditorToolbar

        run={run}

        save={save}

        running={running}

      />






      {/* Monaco Editor */}

      <div className="monaco-container">


        <MonacoEditor


          language={language}


          theme="vs-dark"


          value={code}


          onChange={
            value =>
            setCode(value || "")
          }


          options={{


            fontSize:15,


            minimap:{
              enabled:false
            },


            automaticLayout:true,


            smoothScrolling:true,


            cursorBlinking:"smooth",


            padding:{
              top:15
            }


          }}


        />


      </div>






      {/* Output Console */}

      <div className="output-panel">


        <div className="output-title">

          OUTPUT

        </div>



        <pre>

          {output ||
          "Run your code to see output..."}

        </pre>


      </div>





    </section>


  );

}