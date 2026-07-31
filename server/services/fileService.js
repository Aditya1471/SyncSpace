// server/services/fileService.js


import File from "../models/File.js";





/*
===================================================
CREATE FILE
===================================================
*/

export const createFile = async({

    roomId,

    fileName,

    content = ""

})=>{


    if(!roomId || !fileName){

        throw new Error(
            "Room ID and file name required"
        );

    }




    const existingFile =
    await File.findOne({

        room:roomId,

        fileName

    });





    if(existingFile){

        throw new Error(
            "File already exists"
        );

    }





    const file =
    await File.create({

        room:roomId,

        fileName,

        content,


        path:fileName,


        language:
        detectLanguage(fileName)

    });





    return file;


};









/*
===================================================
GET ALL FILES
===================================================
*/

export const getFiles = async(roomId)=>{


    const files =
    await File.find({

        room:roomId

    })

    .sort({

        createdAt:-1

    });





    return files;


};









/*
===================================================
READ FILE
===================================================
*/

export const readFile = async(

    roomId,

    filePath

)=>{


    const file =
    await File.findOne({

        room:roomId,

        $or:[

            {
                path:filePath
            },

            {
                fileName:filePath
            }

        ]

    });





    if(!file){

        throw new Error(
            "File not found"
        );

    }





    return file;


};









/*
===================================================
UPDATE FILE
===================================================
*/

export const updateFile = async({

    roomId,

    filePath,

    content,

    userId

})=>{



    const file =
    await File.findOne({

        room:roomId,

        $or:[

            {
                path:filePath
            },

            {
                fileName:filePath
            }

        ]

    });






    if(!file){

        throw new Error(
            "File not found"
        );

    }






    file.content =
    content;



    if(userId){

        file.lastEditedBy =
        userId;

    }




    file.updatedAt =
    new Date();




    await file.save();





    return file;


};









/*
===================================================
DELETE FILE
===================================================
*/

export const deleteFile = async(

    roomId,

    filePath

)=>{


    const file =
    await File.findOne({

        room:roomId,

        $or:[

            {
                path:filePath
            },

            {
                fileName:filePath
            }

        ]

    });






    if(!file){

        throw new Error(
            "File not found"
        );

    }





    await File.findByIdAndDelete(

        file._id

    );





    return true;


};









/*
===================================================
RENAME FILE
===================================================
*/

export const renameFile = async({

    roomId,

    oldPath,

    newPath

})=>{



    const file =
    await File.findOne({

        room:roomId,

        path:oldPath

    });





    if(!file){

        throw new Error(
            "File not found"
        );

    }






    file.path =
    newPath;



    file.fileName =
    newPath.split("/").pop();





    await file.save();





    return file;


};









/*
===================================================
MOVE FILE
===================================================
*/

export const moveFile = async({

    roomId,

    oldPath,

    newPath

})=>{


    return await renameFile({

        roomId,

        oldPath,

        newPath

    });


};









/*
===================================================
SEARCH FILES
===================================================
*/

export const searchFiles = async(

    roomId,

    query

)=>{


    if(!query){

        return [];

    }






    const files =
    await File.find({

        room:roomId,


        $or:[


            {

                fileName:{

                    $regex:query,

                    $options:"i"

                }

            },


            {

                content:{

                    $regex:query,

                    $options:"i"

                }

            }


        ]

    });






    return files;


};









/*
===================================================
DETECT LANGUAGE
===================================================
*/

const detectLanguage = (fileName)=>{


    const extension =
    fileName
    .split(".")
    .pop()
    .toLowerCase();




    const languages={


        js:"javascript",

        jsx:"javascript",

        ts:"typescript",

        tsx:"typescript",

        py:"python",

        java:"java",

        cpp:"cpp",

        c:"c",

        html:"html",

        css:"css",

        json:"json"

    };





    return (

        languages[extension]

        ||

        "plaintext"

    );


};