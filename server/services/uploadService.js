import fs from "fs/promises";
import path from "path";
import crypto from "crypto";





const UPLOAD_DIR =
path.join(
    process.cwd(),
    "uploads"
);





/*
===================================================
CREATE UPLOAD DIRECTORY
===================================================
*/

const createUploadDirectory =
async()=>{


    await fs.mkdir(

        UPLOAD_DIR,

        {
            recursive:true
        }

    );


};









/*
===================================================
UPLOAD FILE
===================================================
*/

export const uploadFile =
async(file)=>{


    if(!file){

        throw new Error(
            "No file uploaded"
        );

    }




    await createUploadDirectory();





    const extension =
    path.extname(
        file.originalname
    );



    const fileName =

    crypto
    .randomBytes(12)
    .toString("hex")
    +
    extension;





    const filePath =
    path.join(

        UPLOAD_DIR,

        fileName

    );





    await fs.writeFile(

        filePath,

        file.buffer

    );





    return {


        originalName:
        file.originalname,


        fileName,


        path:filePath,


        size:file.size,


        type:
        file.mimetype,


        url:
        `/uploads/${fileName}`


    };


};









/*
===================================================
UPLOAD MULTIPLE FILES
===================================================
*/

export const uploadMultiple =
async(files)=>{


    if(
        !files ||
        files.length===0
    ){

        throw new Error(
            "No files uploaded"
        );

    }





    const uploaded=[];



    for(
        const file of files
    ){


        const result =
        await uploadFile(
            file
        );


        uploaded.push(
            result
        );


    }





    return uploaded;


};









/*
===================================================
DELETE UPLOADED FILE
===================================================
*/

export const deleteUpload =
async(fileName)=>{


    const filePath =
    path.join(

        UPLOAD_DIR,

        fileName

    );



    await fs.rm(

        filePath,

        {
            force:true
        }

    );



    return true;


};









/*
===================================================
GET FILE PATH
===================================================
*/

export const getUploadPath =
(fileName)=>{


    return path.join(

        UPLOAD_DIR,

        fileName

    );


};









/*
===================================================
CHECK FILE EXISTS
===================================================
*/

export const uploadExists =
async(fileName)=>{


    try{


        await fs.access(

            getUploadPath(
                fileName
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
VALIDATE FILE TYPE
===================================================
*/

export const validateFileType =
(
    mimetype
)=>{


    const allowed = [


        "image/png",

        "image/jpeg",

        "image/jpg",

        "application/pdf",

        "text/plain",

        "application/javascript",

        "text/javascript"


    ];





    return allowed.includes(
        mimetype
    );


};









/*
===================================================
VALIDATE FILE SIZE
===================================================
*/

export const validateFileSize =
(
    size,
    maxSize=10*1024*1024
)=>{


    return size <= maxSize;


};









/*
===================================================
GET UPLOAD INFO
===================================================
*/

export const getUploadInfo =
async(fileName)=>{


    const filePath =
    getUploadPath(
        fileName
    );



    const stats =
    await fs.stat(
        filePath
    );



    return {


        fileName,


        size:
        stats.size,


        createdAt:
        stats.birthtime,


        updatedAt:
        stats.mtime


    };


};