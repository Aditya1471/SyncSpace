// server/services/editorService.js

import File from "../models/File.js";



/*
===================================================
OPEN FILE
===================================================
*/

export const openFile = async (
    roomId,
    fileId
) => {

    const file =
    await File.findOne({

        room: roomId,

        _id: fileId

    })
    .populate(
        "lastEditedBy",
        "username avatar"
    )
    .populate(
        "activeEditors",
        "username avatar"
    );


    if(!file){

        throw new Error(
            "File not found"
        );

    }


    return file;

};





/*
===================================================
SAVE FILE
===================================================
*/

export const saveFile = async ({
    roomId,
    fileId,
    content,
    language,
    userId
}) => {


    const file =
    await File.findOne({

        room:roomId,

        _id:fileId

    });



    if(!file){

        throw new Error(
            "File not found"
        );

    }



    if(content !== undefined){

        file.content =
        content;

    }



    if(language){

        file.language =
        language;

    }



    if(userId){

        file.lastEditedBy =
        userId;

    }



    await file.save();



    return file;

};





/*
===================================================
UPDATE CODE
===================================================
*/

export const updateCode = async ({
    roomId,
    fileId,
    code
}) => {


    const file =
    await File.findOne({

        room:roomId,

        _id:fileId

    });



    if(!file){

        throw new Error(
            "File not found"
        );

    }



    file.content =
    code;



    await file.save();



    return {

        fileId:file._id,

        content:file.content

    };


};





/*
===================================================
AUTO SAVE
===================================================
*/

export const autoSave = async ({
    roomId,
    fileId,
    content
}) => {


    const file =
    await File.findOne({

        room:roomId,

        _id:fileId

    });



    if(!file){

        throw new Error(
            "File not found"
        );

    }



    file.content =
    content;



    file.lastSaved =
    new Date();



    await file.save();



    return {

        saved:true,

        savedAt:file.lastSaved,

        file

    };


};





/*
===================================================
GET EDITOR STATE
===================================================
*/

export const getEditorState = async (
    roomId
) => {


    const files =
    await File.find({

        room:roomId

    })
    .populate(
        "lastEditedBy",
        "username avatar"
    );



    return {

        roomId,

        files

    };


};





/*
===================================================
UPDATE LANGUAGE
===================================================
*/

export const updateLanguage = async ({
    roomId,
    fileId,
    language
}) => {


    const file =
    await File.findOne({

        room:roomId,

        _id:fileId

    });



    if(!file){

        throw new Error(
            "File not found"
        );

    }



    file.language =
    language;



    await file.save();



    return file;

};





/*
===================================================
UPDATE THEME
===================================================
*/

export const updateTheme = async (
    roomId,
    theme
) => {


    const files =
    await File.updateMany(

        {
            room:roomId
        },

        {
            theme
        }

    );



    return {

        modified:
        files.modifiedCount

    };


};





/*
===================================================
GET ACTIVE FILE
===================================================
*/

export const getActiveFile = async (
    roomId
) => {


    const file =
    await File.findOne({

        room:roomId

    })
    .sort({

        updatedAt:-1

    });



    if(!file){

        throw new Error(
            "No active file found"
        );

    }



    return file;

};





/*
===================================================
DELETE EDITOR FILE
===================================================
*/

export const deleteEditorFile = async (
    roomId,
    fileId
) => {


    const file =
    await File.findOneAndDelete({

        room:roomId,

        _id:fileId

    });



    if(!file){

        throw new Error(
            "File not found"
        );

    }



    return {

        deleted:true,

        fileId

    };


};