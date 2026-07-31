import asyncHandler from "../utils/asyncHandler.js";

import {

    uploadFile,

    uploadMultiple,

    deleteUpload,

    getUploadInfo,

    validateFileType,

    validateFileSize

} from "../services/uploadService.js";





/*
===================================================
UPLOAD SINGLE FILE
POST /api/upload
===================================================
*/

export const uploadSingle =
asyncHandler(
async(req,res)=>{


    const file =
    req.file;




    if(!file){

        return res.status(400).json({

            success:false,

            message:
            "File is required"

        });

    }





    const validType =
    validateFileType(

        file.mimetype

    );





    if(!validType){

        return res.status(400).json({

            success:false,

            message:
            "File type not allowed"

        });

    }





    const validSize =
    validateFileSize(

        file.size

    );





    if(!validSize){

        return res.status(400).json({

            success:false,

            message:
            "File size exceeds limit"

        });

    }





    const uploaded =
    await uploadFile(

        file

    );





    res.status(201).json({

        success:true,

        message:
        "File uploaded successfully",

        data:uploaded

    });


});









/*
===================================================
UPLOAD MULTIPLE FILES
POST /api/upload/multiple
===================================================
*/

export const uploadMultipleFiles =
asyncHandler(
async(req,res)=>{


    const files =
    req.files;




    if(
        !files ||
        files.length===0
    ){

        return res.status(400).json({

            success:false,

            message:
            "Files required"

        });

    }





    for(
        const file of files
    ){

        if(
            !validateFileType(
                file.mimetype
            )
        ){

            return res.status(400).json({

                success:false,

                message:
                `${file.originalname} type not allowed`

            });

        }





        if(
            !validateFileSize(
                file.size
            )
        ){

            return res.status(400).json({

                success:false,

                message:
                `${file.originalname} size exceeded`

            });

        }

    }





    const uploaded =
    await uploadMultiple(

        files

    );





    res.status(201).json({

        success:true,

        message:
        "Files uploaded successfully",

        data:uploaded

    });


});









/*
===================================================
DELETE UPLOAD
DELETE /api/upload/:fileName
===================================================
*/

export const removeUpload =
asyncHandler(
async(req,res)=>{


    await deleteUpload(

        req.params.fileName

    );





    res.status(200).json({

        success:true,

        message:
        "File deleted successfully"

    });


});









/*
===================================================
GET UPLOAD INFORMATION
GET /api/upload/:fileName
===================================================
*/

export const getUploadDetails =
asyncHandler(
async(req,res)=>{


    const info =
    await getUploadInfo(

        req.params.fileName

    );





    res.status(200).json({

        success:true,

        data:info

    });


});