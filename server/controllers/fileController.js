import asyncHandler from "../utils/asyncHandler.js";

import {
    createFile,
    readFile,
    updateFile,
    deleteFile,
    renameFile,
    moveFile,
    getFiles,
    searchFiles
} from "../services/fileService.js";



/*
===================================================
CREATE FILE
POST /api/files/:roomId
===================================================
*/

export const create =
asyncHandler(
async(req,res)=>{


    const {

        fileName,

        content

    } = req.body;



    const file =
    await createFile({

        roomId:
        req.params.roomId,

        fileName,

        content

    });





    res.status(201).json({

        success:true,

        message:
        "File created successfully",

        data:file

    });


});









/*
===================================================
GET ALL FILES
GET /api/files/:roomId
===================================================
*/

export const getAllFiles =
asyncHandler(
async(req,res)=>{


    const files =
    await getFiles(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        count:
        files.length,

        data:files

    });


});









/*
===================================================
READ FILE
GET /api/files/:roomId/:filePath
===================================================
*/

export const getFile =
asyncHandler(
async(req,res)=>{


    const file =
    await readFile(

        req.params.roomId,

        req.params.filePath

    );





    res.status(200).json({

        success:true,

        data:file

    });


});









/*
===================================================
UPDATE FILE
PUT /api/files/:roomId
===================================================
*/

export const update =
asyncHandler(
async(req,res)=>{


    const {

        filePath,

        content

    } = req.body;





    const file =
    await updateFile({

        roomId:
        req.params.roomId,

        filePath,

        content

    });





    res.status(200).json({

        success:true,

        message:
        "File updated successfully",

        data:file

    });


});









/*
===================================================
DELETE FILE
DELETE /api/files/:roomId
===================================================
*/

export const remove =
asyncHandler(
async(req,res)=>{


    const {

        filePath

    } = req.body;





    await deleteFile(

        req.params.roomId,

        filePath

    );





    res.status(200).json({

        success:true,

        message:
        "File deleted successfully"

    });


});









/*
===================================================
RENAME FILE
PUT /api/files/:roomId/rename
===================================================
*/

export const rename =
asyncHandler(
async(req,res)=>{


    const {

        oldPath,

        newPath

    } = req.body;





    const result =
    await renameFile({

        roomId:
        req.params.roomId,

        oldPath,

        newPath

    });





    res.status(200).json({

        success:true,

        message:
        "File renamed successfully",

        data:result

    });


});









/*
===================================================
MOVE FILE
PUT /api/files/:roomId/move
===================================================
*/

export const move =
asyncHandler(
async(req,res)=>{


    const {

        oldPath,

        newPath

    } = req.body;





    const result =
    await moveFile({

        roomId:
        req.params.roomId,

        oldPath,

        newPath

    });





    res.status(200).json({

        success:true,

        message:
        "File moved successfully",

        data:result

    });


});









/*
===================================================
SEARCH FILES
GET /api/files/:roomId/search
===================================================
*/

export const search =
asyncHandler(
async(req,res)=>{


    const {

        query

    } = req.query;





    const files =
    await searchFiles(

        req.params.roomId,

        query

    );





    res.status(200).json({

        success:true,

        count:
        files.length,

        data:files

    });


});