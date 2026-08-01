import React, {
  useState,
  useRef
} from "react";

import {
  FaTerminal,
  FaTrash,
  FaChevronRight
} from "react-icons/fa";


import {
  executeTerminal
} from "../../services/terminalService";



export default function Terminal() {


  const [output,setOutput] =
    useState(
      "SyncSpace Terminal Ready...\n"
    );


  const [commandText,setCommandText] =
    useState("");


  const [loading,setLoading] =
    useState(false);



  const inputRef =
    useRef(null);





  const runCommand = async()=>{


    if(!commandText.trim())
      return;



    try{


      setLoading(true);



      setOutput(prev=>

        prev +

        `\n$ ${commandText}\n`

      );



      const result =
      await executeTerminal(
        commandText
      );



      setOutput(prev=>

        prev +

        (
          result.output ||
          result.error ||
          "No response"
        )

      );



    }


    catch(error){


      setOutput(prev=>

        prev +

        `\nError: ${error.message}`

      );


    }


    finally{


      setCommandText("");

      setLoading(false);


      inputRef.current?.focus();


    }


  };







  const handleKeyDown=(e)=>{


    if(e.key==="Enter"){


      runCommand();


    }


  };







  const clearTerminal=()=>{


    setOutput("");

  };







  return (


    <section className="terminal">





      {/* HEADER */}

      <div className="terminal-header">


        <div className="terminal-title">


          <FaTerminal/>


          TERMINAL


        </div>





        <button

          className="terminal-clear"

          onClick={clearTerminal}

          title="Clear"

        >


          <FaTrash/>


        </button>



      </div>








      {/* OUTPUT */}

      <div className="terminal-output">


        <pre>

          {output}

        </pre>


      </div>








      {/* INPUT */}

      <div className="terminal-input-area">


        <FaChevronRight/>



        <input


          ref={inputRef}


          value={commandText}


          disabled={loading}


          placeholder={
            loading
            ?
            "Executing..."
            :
            "Type command..."
          }


          onChange={
            e=>
            setCommandText(
              e.target.value
            )
          }


          onKeyDown={handleKeyDown}


        />


      </div>





    </section>


  );

}