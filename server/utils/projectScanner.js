import fs from "fs";
import path from "path";





/*
====================================================
PROJECT SCANNER
====================================================

Used for:

- File Explorer
- Workspace Tree
- Project Loading

Example Output:

[
 {
   name:"src",
   type:"folder",
   children:[
      {
        name:"App.jsx",
        type:"file"
      }
   ]
 }
]

====================================================
*/





const IGNORE_LIST = [

    "node_modules",

    ".git",

    ".env",

    ".DS_Store"

];







/*
====================================================
SCAN PROJECT DIRECTORY
====================================================
*/

export const scanProject = (
    directory
)=>{


    if(
        !fs.existsSync(directory)
    ){

        return [];

    }





    const items =
    fs.readdirSync(
        directory
    );





    const tree = [];





    items.forEach(
        (item)=>{


            if(
                IGNORE_LIST.includes(item)
            ){

                return;

            }





            const fullPath =
            path.join(
                directory,
                item
            );





            const stats =
            fs.statSync(
                fullPath
            );





            if(
                stats.isDirectory()
            ){


                tree.push({

                    name:item,

                    type:"folder",

                    path:
                    normalizePath(
                        fullPath
                    ),


                    children:
                    scanProject(
                        fullPath
                    )

                });


            }

            else{


                tree.push({

                    name:item,

                    type:"file",

                    path:
                    normalizePath(
                        fullPath
                    ),


                    extension:
                    path.extname(item),


                    size:
                    stats.size,


                    modifiedAt:
                    stats.mtime

                });


            }


        }

    );





    return tree;


};







/*
====================================================
GET ALL FILES ONLY
====================================================
*/

export const getAllFiles = (
    directory,
    files=[]
)=>{


    if(
        !fs.existsSync(directory)
    ){

        return files;

    }





    const items =
    fs.readdirSync(
        directory
    );





    items.forEach(item=>{


        if(
            IGNORE_LIST.includes(item)
        ){

            return;

        }





        const fullPath =
        path.join(
            directory,
            item
        );





        const stats =
        fs.statSync(
            fullPath
        );





        if(
            stats.isDirectory()
        ){

            getAllFiles(
                fullPath,
                files
            );

        }

        else{


            files.push(
                normalizePath(
                    fullPath
                )
            );


        }


    });





    return files;


};







/*
====================================================
FIND FILE
====================================================
*/

export const findFile = (
    directory,
    filename
)=>{


    const files =
    getAllFiles(
        directory
    );



    return files.find(
        file =>
        path.basename(file)
        === filename
    );

};







/*
====================================================
NORMALIZE PATH
====================================================
*/

const normalizePath = (
    filePath
)=>{


    return path
        .normalize(filePath)
        .replace(
            /\\/g,
            "/"
        );


};





export default scanProject;