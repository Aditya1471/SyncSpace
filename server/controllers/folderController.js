import asyncHandler from "../utils/asyncHandler.js";

import {

    createFolder,

    getFolderContent,

    getFolderTree,

    renameFolder,

    deleteFolder,

    moveFolder,

    folderExists

} from "../services/folderService.js";





/*
===================================================
CREATE FOLDER
POST /api/folders/:roomId
===================================================
*/

export const create =
asyncHandler(
async(req,res)=>{


    const {

        folderPath

    } = req.body;





    const folder =
    await createFolder(

        req.params.roomId,

        folderPath

    );





    res.status(201).json({

        success:true,

        message:
        "Folder created successfully",

        data:folder

    });


});









/*
===================================================
GET FOLDER CONTENT
GET /api/folders/:roomId/content
===================================================
*/

export const getContent =
asyncHandler(
async(req,res)=>{


    const {

        folderPath

    } = req.query;





    const content =
    await getFolderContent(

        req.params.roomId,

        folderPath || ""

    );





    res.status(200).json({

        success:true,

        data:content

    });


});









/*
===================================================
GET COMPLETE TREE
GET /api/folders/:roomId/tree
===================================================
*/

export const getTree =
asyncHandler(
async(req,res)=>{


    const tree =
    await getFolderTree(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        data:tree

    });


});









/*
===================================================
RENAME FOLDER
PUT /api/folders/:roomId/rename
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
    await renameFolder(

        req.params.roomId,

        oldPath,

        newPath

    );





    res.status(200).json({

        success:true,

        message:
        "Folder renamed successfully",

        data:result

    });


});









/*
===================================================
DELETE FOLDER
DELETE /api/folders/:roomId
===================================================
*/

export const remove =
asyncHandler(
async(req,res)=>{


    const {

        folderPath

    } = req.body;





    await deleteFolder(

        req.params.roomId,

        folderPath

    );





    res.status(200).json({

        success:true,

        message:
        "Folder deleted successfully"

    });


});









/*
===================================================
MOVE FOLDER
PUT /api/folders/:roomId/move
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
    await moveFolder(

        req.params.roomId,

        oldPath,

        newPath

    );





    res.status(200).json({

        success:true,

        message:
        "Folder moved successfully",

        data:result

    });


});









/*
===================================================
CHECK FOLDER EXISTS
GET /api/folders/:roomId/check
===================================================
*/

export const check =
asyncHandler(
async(req,res)=>{


    const {

        folderPath

    } = req.query;





    const exists =
    await folderExists(

        req.params.roomId,

        folderPath

    );





    res.status(200).json({

        success:true,

        exists

    });


});