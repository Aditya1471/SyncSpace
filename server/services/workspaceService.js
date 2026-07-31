import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import {
  scanProject
} from "../utils/projectScanner.js";

import {
  WORKSPACE_DIR
} from "../utils/constants.js";



const __filename =
fileURLToPath(import.meta.url);


const __dirname =
path.dirname(__filename);



const workspaceRoot =
path.join(
  __dirname,
  "..",
  WORKSPACE_DIR
);





/*
===================================================
GET WORKSPACE PATH
===================================================
*/

export const getWorkspacePath =
(roomId)=>{

  return path.join(
    workspaceRoot,
    roomId
  );

};








/*
===================================================
CREATE WORKSPACE
===================================================
*/

export const createWorkspace =
async(roomId)=>{


  const workspacePath =
  getWorkspacePath(roomId);



  await fs.mkdir(
    workspacePath,
    {
      recursive:true
    }
  );



  const folders = [

    "src",

    "src/components",

    "src/pages",

    "public",

    "assets"

  ];



  for(
    const folder of folders
  ){

    await fs.mkdir(

      path.join(
        workspacePath,
        folder
      ),

      {
        recursive:true
      }

    );

  }




  const files = {


    "src/App.jsx":

`
function App(){

 return (
    <div>
      <h1>
        SyncSpace Workspace
      </h1>
    </div>
 );

}


export default App;
`,



    "src/index.css":

`
body{

 margin:0;

 font-family:sans-serif;

}
`,



    "README.md":

`
# SyncSpace Project

Collaborative Coding Workspace
`,


    "package.json":

`
{
 "name":"syncspace-project",
 "version":"1.0.0"
}
`

  };





  for(
    const [file,content]
    of Object.entries(files)
  ){


    const filePath =
    path.join(
      workspacePath,
      file
    );


    await fs.writeFile(
      filePath,
      content
    );


  }





  return {

    success:true,

    path:workspacePath

  };


};









/*
===================================================
CHECK WORKSPACE EXISTS
===================================================
*/

export const workspaceExists =
async(roomId)=>{


  try{


    await fs.access(
      getWorkspacePath(roomId)
    );


    return true;


  }

  catch(error){


    return false;

  }


};









/*
===================================================
GET WORKSPACE TREE
===================================================
*/

export const getWorkspaceTree =
async(roomId)=>{


  const exists =
  await workspaceExists(roomId);



  if(!exists){

    throw new Error(
      "Workspace does not exist"
    );

  }




  return await scanProject(

    getWorkspacePath(roomId)

  );


};









/*
===================================================
DELETE WORKSPACE
===================================================
*/

export const deleteWorkspace =
async(roomId)=>{


  const workspacePath =
  getWorkspacePath(roomId);



  await fs.rm(

    workspacePath,

    {
      recursive:true,

      force:true
    }

  );



  return {

    success:true,

    message:
    "Workspace deleted"

  };


};









/*
===================================================
CLEAR WORKSPACE
===================================================
*/

export const clearWorkspace =
async(roomId)=>{


  const workspacePath =
  getWorkspacePath(roomId);



  const files =
  await fs.readdir(
    workspacePath
  );



  for(
    const file of files
  ){

    await fs.rm(

      path.join(
        workspacePath,
        file
      ),

      {
        recursive:true,

        force:true
      }

    );

  }



  return true;


};









/*
===================================================
RENAME WORKSPACE
===================================================
*/

export const renameWorkspace =
async(
  oldRoomId,
  newRoomId
)=>{


  const oldPath =
  getWorkspacePath(
    oldRoomId
  );


  const newPath =
  getWorkspacePath(
    newRoomId
  );



  await fs.rename(
    oldPath,
    newPath
  );



  return {

    success:true

  };


};









/*
===================================================
GET WORKSPACE INFO
===================================================
*/

export const getWorkspaceInfo =
async(roomId)=>{


  const workspacePath =
  getWorkspacePath(roomId);



  const exists =
  await workspaceExists(
    roomId
  );



  if(!exists){

    throw new Error(
      "Workspace not found"
    );

  }



  const stats =
  await fs.stat(
    workspacePath
  );



  return {

    roomId,

    path:
    workspacePath,

    createdAt:
    stats.birthtime,

    updatedAt:
    stats.mtime

  };


};