import chokidar from "chokidar";
import path from "path";





/*
====================================================
FILE WATCHER SERVICE
====================================================

Used for:

- Real-time editor sync
- Workspace changes
- VS Code like explorer updates

====================================================
*/





export const createFileWatcher = (
    workspacePath,
    callback
) => {


    if(!workspacePath){

        throw new Error(
            "Workspace path is required"
        );

    }



    const watcher =
    chokidar.watch(
        workspacePath,
        {

            ignored:[

                /(^|[\/\\])\../,

                "**/node_modules/**",

                "**/.git/**"

            ],


            persistent:true,


            ignoreInitial:true,


            depth:10

        }
    );





    /*
    ================================================
    FILE CREATED
    ================================================
    */

    watcher.on(
        "add",
        (filePath)=>{


            callback({

                event:
                "file-created",


                filePath:
                normalizePath(filePath)

            });


        }
    );






    /*
    ================================================
    FILE UPDATED
    ================================================
    */

    watcher.on(
        "change",
        (filePath)=>{


            callback({

                event:
                "file-updated",


                filePath:
                normalizePath(filePath)

            });


        }
    );






    /*
    ================================================
    FILE DELETED
    ================================================
    */

    watcher.on(
        "unlink",
        (filePath)=>{


            callback({

                event:
                "file-deleted",


                filePath:
                normalizePath(filePath)

            });


        }
    );







    /*
    ================================================
    FOLDER CREATED
    ================================================
    */

    watcher.on(
        "addDir",
        (folderPath)=>{


            callback({

                event:
                "folder-created",


                folderPath:
                normalizePath(folderPath)

            });


        }
    );






    /*
    ================================================
    FOLDER DELETED
    ================================================
    */

    watcher.on(
        "unlinkDir",
        (folderPath)=>{


            callback({

                event:
                "folder-deleted",


                folderPath:
                normalizePath(folderPath)

            });


        }
    );






    /*
    ================================================
    WATCHER ERROR
    ================================================
    */

    watcher.on(
        "error",
        (error)=>{


            console.error(
                "File Watcher Error:",
                error.message
            );


        }
    );





    return watcher;

};







/*
====================================================
NORMALIZE FILE PATH
====================================================
*/

const normalizePath = (filePath)=>{


    return path
        .normalize(filePath)
        .replace(
            /\\/g,
            "/"
        );


};







/*
====================================================
STOP WATCHER
====================================================
*/

export const closeFileWatcher =
async(watcher)=>{


    if(watcher){

        await watcher.close();

    }


};