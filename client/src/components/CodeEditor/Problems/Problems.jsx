import React, { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Trash2
} from "lucide-react";

import "./Problems.css";


export default function Problems() {

  const [problems, setProblems] = useState([
    {
      id:1,
      type:"error",
      message:"Unexpected token",
      file:"App.jsx",
      line:12
    },
    {
      id:2,
      type:"warning",
      message:"Unused variable 'data'",
      file:"server.js",
      line:25
    },
    {
      id:3,
      type:"info",
      message:"Consider using const instead of let",
      file:"index.js",
      line:5
    }
  ]);


  const clearProblems =()=>{

    setProblems([]);

  };


  const getIcon=(type)=>{

    if(type==="error")
      return <AlertCircle className="error-icon"/>;


    if(type==="warning")
      return <AlertTriangle className="warning-icon"/>;


    return <Info className="info-icon"/>;

  };


  return (

    <div className="problems-container">


      <div className="problems-header">


        <div className="problem-title">

          <span>
            Problems
          </span>


          <span className="count">

            {problems.length}

          </span>


        </div>



        <button
        className="clear-btn"
        onClick={clearProblems}
        >

          <Trash2 size={15}/>

          Clear


        </button>


      </div>



      <div className="problem-list">


      {
        problems.length===0 ?

        (

          <div className="empty">

            No problems detected 🎉

          </div>

        )


        :

        problems.map(problem=>(


          <div
          className="problem-item"
          key={problem.id}
          >


            <div className="problem-icon">

              {getIcon(problem.type)}

            </div>



            <div className="problem-details">


              <div className="problem-message">

                {problem.message}

              </div>


              <div className="problem-location">

                {problem.file}

                :

                {problem.line}


              </div>


            </div>



            <button
            className="remove"
            onClick={()=>{

              setProblems(
                problems.filter(
                  p=>p.id!==problem.id
                )
              )

            }}
            >

              <X size={14}/>

            </button>


          </div>


        ))

      }


      </div>


    </div>

  );

}