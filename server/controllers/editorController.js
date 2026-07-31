import asyncHandler from "../utils/asyncHandler.js";

import {
    openFile,
    saveFile,
    updateCode,
    getEditorState,
    updateLanguage,
    updateTheme,
    getActiveFile,
    deleteEditorFile,
    autoSave
} from "../services/editorService.js";



/*
===================================================
OPEN FILE
GET /api/editor/:roomId/file/:fileId
===================================================
*/

export const openEditorFile =
asyncHandler(
async(req,res)=>{


    const file =
    await openFile(

        req.params.roomId,

        req.params.fileId

    );




    res.status(200).json({

        success:true,

        data:file

    });


});









/*
===================================================
SAVE FILE
POST /api/editor/:roomId/save
===================================================
*/

export const saveEditorFile =
asyncHandler(
async(req,res)=>{


    const {

        fileId,

        content,

        language

    } = req.body;





    const saved =
    await saveFile({

        roomId:
        req.params.roomId,

        fileId,

        content,

        language,

        userId:
        req.user?._id

    });





    res.status(200).json({

        success:true,

        message:
        "File saved successfully",

        data:saved

    });


});









/*
===================================================
UPDATE CODE
PUT /api/editor/:roomId/code
===================================================
*/

export const updateEditorCode =
asyncHandler(
async(req,res)=>{


    const {

        fileId,

        code

    } = req.body;





    const result =
    await updateCode({

        roomId:
        req.params.roomId,

        fileId,

        code

    });





    res.status(200).json({

        success:true,

        data:result

    });


});









/*
===================================================
AUTO SAVE
POST /api/editor/:roomId/autosave
===================================================
*/

export const autoSaveEditor =
asyncHandler(
async(req,res)=>{


    const {

        fileId,

        content

    } = req.body;





    const result =
    await autoSave({

        roomId:
        req.params.roomId,

        fileId,

        content

    });





    res.status(200).json({

        success:true,

        message:
        "Auto saved",

        data:result

    });


});









/*
===================================================
GET EDITOR STATE
GET /api/editor/:roomId/state
===================================================
*/

export const getEditor =
asyncHandler(
async(req,res)=>{


    const state =
    await getEditorState(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        data:state

    });


});









/*
===================================================
UPDATE LANGUAGE
PUT /api/editor/:roomId/language
===================================================
*/

export const changeLanguage =
asyncHandler(
async(req,res)=>{


    const {

        fileId,

        language

    } = req.body;





    const result =
    await updateLanguage({

        roomId:
        req.params.roomId,

        fileId,

        language

    });





    res.status(200).json({

        success:true,

        message:
        "Language updated",

        data:result

    });


});









/*
===================================================
UPDATE THEME
PUT /api/editor/:roomId/theme
===================================================
*/

export const changeTheme =
asyncHandler(
async(req,res)=>{


    const {

        theme

    } = req.body;





    const result =
    await updateTheme(

        req.params.roomId,

        theme

    );





    res.status(200).json({

        success:true,

        message:
        "Theme updated",

        data:result

    });


});









/*
===================================================
GET ACTIVE FILE
GET /api/editor/:roomId/active
===================================================
*/

export const activeFile =
asyncHandler(
async(req,res)=>{


    const file =
    await getActiveFile(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        data:file

    });


});









/*
===================================================
DELETE EDITOR FILE
DELETE /api/editor/:roomId/file/:fileId
===================================================
*/

export const removeEditorFile =
asyncHandler(
async(req,res)=>{


    await deleteEditorFile(

        req.params.roomId,

        req.params.fileId

    );





    res.status(200).json({

        success:true,

        message:
        "File removed from editor"

    });


});