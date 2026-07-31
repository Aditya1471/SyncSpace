import fs from "fs/promises";
import path from "path";

import {
    getWorkspacePath
} from "./workspaceService.js";





/*
===================================================
CREATE FOLDER
===================================================
*/

export const createFolder =
async(
    roomId,
    folderPath
)=>{


    if(
        !roomId ||
        !folderPath
    ){

        throw new Error(
            "Room and folder path required"
        );

    }





    const workspacePath =
    getWorkspacePath(
        roomId
    );



    const fullPath =
    path.join(
        workspacePath,
        folderPath
    );





    await fs.mkdir(

        fullPath,

        {
            recursive:true
        }

    );





    return {

        success:true,

        path:folderPath

    };


};









/*
===================================================
GET FOLDER CONTENT
===================================================
*/

export const getFolderContent =
async(
    roomId,
    folderPath=""
)=>{


    const workspacePath =
    getWorkspacePath(
        roomId
    );



    const fullPath =
    path.join(
        workspacePath,
        folderPath
    );



    const items =
    await fs.readdir(

        fullPath,

        {
            withFileTypes:true
        }

    );





    return items.map(item=>({


        name:item.name,


        type:
        item.isDirectory()
        ?
        "folder"
        :
        "file",


        path:
        path.join(
            folderPath,
            item.name
        )


    }));


};









/*
===================================================
RENAME FOLDER
===================================================
*/

export const renameFolder =
async(
    roomId,
    oldPath,
    newPath
)=>{


    const workspacePath =
    getWorkspacePath(
        roomId
    );



    const oldFolder =
    path.join(
        workspacePath,
        oldPath
    );



    const newFolder =
    path.join(
        workspacePath,
        newPath
    );





    await fs.rename(

        oldFolder,

        newFolder

    );





    return {

        success:true

    };


};









/*
===================================================
DELETE FOLDER
===================================================
*/

export const deleteFolder =
async(
    roomId,
    folderPath
)=>{


    const workspacePath =
    getWorkspacePath(
        roomId
    );



    const fullPath =
    path.join(
        workspacePath,
        folderPath
    );





    await fs.rm(

        fullPath,

        {

            recursive:true,

            force:true

        }

    );





    return {

        success:true

    };


};









/*
===================================================
CHECK FOLDER EXISTS
===================================================
*/

export const folderExists =
async(
    roomId,
    folderPath
)=>{


    try{


        await fs.access(

            path.join(

                getWorkspacePath(roomId),

                folderPath

            )

        );


        return true;


    }
    catch(error){


        return false;


    }


};









/*
===================================================
MOVE FOLDER
===================================================
*/

export const moveFolder =
async(
    roomId,
    oldPath,
    newPath
)=>{


    return await renameFolder(

        roomId,

        oldPath,

        newPath

    );


};









/*
===================================================
GET COMPLETE FOLDER TREE
===================================================
*/

export const getFolderTree =
async(
    roomId,
    currentPath=""
)=>{


    const workspacePath =
    getWorkspacePath(
        roomId
    );



    const fullPath =
    path.join(
        workspacePath,
        currentPath
    );



    const entries =
    await fs.readdir(

        fullPath,

        {
            withFileTypes:true
        }

    );



    const tree=[];





    for(
        const entry of entries
    ){


        const entryPath =
        path.join(
            currentPath,
            entry.name
        );



        if(entry.isDirectory()){


            tree.push({

                name:entry.name,

                type:"folder",

                children:
                await getFolderTree(
                    roomId,
                    entryPath
                )

            });


        }
        else{


            tree.push({

                name:entry.name,

                type:"file",

                path:entryPath

            });


        }


    }





    return tree;


};