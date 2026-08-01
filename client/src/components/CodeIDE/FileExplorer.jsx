import React, {
  useEffect,
  useState
} from "react";

import {
  FaFileCode,
  FaFolder,
  FaSyncAlt,
  FaPlus
} from "react-icons/fa";


import {
  getFiles
} from "../../services/fileService";



export default function FileExplorer({

  onFileSelect

}) {


  const [files,setFiles] =
  useState([]);


  const [activeFile,setActiveFile] =
  useState(null);


  const [loading,setLoading] =
  useState(false);





  useEffect(()=>{

    loadFiles();

  },[]);






  const loadFiles = async()=>{


    try{


      setLoading(true);


      const data =
      await getFiles();



      setFiles(
        data.files || []
      );


    }


    catch(error){


      console.log(
        "File loading error:",
        error.message
      );


    }


    finally{


      setLoading(false);


    }


  };







  const selectFile=(file)=>{


    setActiveFile(
      file._id
    );


    if(onFileSelect){

      onFileSelect(file);

    }


  };







  return (


    <aside className="file-explorer">





      {/* Header */}


      <div className="explorer-header">


        <span>

          EXPLORER

        </span>



        <div className="explorer-actions">


          <button
            title="New File"
          >

            <FaPlus/>

          </button>



          <button
            title="Refresh"
            onClick={loadFiles}
          >

            <FaSyncAlt/>

          </button>


        </div>


      </div>







      {/* Workspace */}


      <div className="workspace-title">


        <FaFolder/>

        <span>
          WORKSPACE
        </span>


      </div>








      {

        loading ?


        (

          <div className="loading">

            Loading files...

          </div>


        )


        :


        files.length === 0 ?


        (

          <div className="empty-files">


            No files found


          </div>


        )


        :



        files.map(file=>(


          <div

            key={file._id}

            className={

              `file-item 
              ${
                activeFile === file._id
                ?
                "active"
                :
                ""
              }`

            }


            onClick={()=>selectFile(file)}

          >


            <FaFileCode/>


            <span>

              {file.name}

            </span>



          </div>


        ))


      }




    </aside>


  );

}