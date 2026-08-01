import React from "react";

import {
  FaCodeBranch,
  FaCircle,
  FaWifi,
  FaLock
} from "react-icons/fa";



export default function StatusBar({

  language = "JavaScript",

  branch = "main",

  online = true

}) {



  return (


    <footer className="status-bar">





      {/* LEFT SIDE */}

      <div className="status-left">


        <span className="status-item">


          <FaCodeBranch/>


          {branch}


        </span>



        <span className="status-item">


          <FaLock/>


          UTF-8


        </span>



      </div>







      {/* RIGHT SIDE */}

      <div className="status-right">


        <span className="status-item">


          {language}


        </span>





        <span

          className={

            online

            ?

            "status-online"

            :

            "status-offline"

          }

        >



          <FaCircle/>


          {

          online

          ?

          "SyncSpace Online"

          :

          "Offline"

          }



        </span>





        <span className="status-item">


          <FaWifi/>


        </span>




      </div>





    </footer>


  );

}