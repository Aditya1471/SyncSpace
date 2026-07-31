// server/controllers/settingsController.js

import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";



/*
=================================================
GET USER SETTINGS
GET /api/settings
=================================================
*/

export const getUserSettings =
asyncHandler(
async(req,res)=>{


    const user =
    await User.findById(
        req.user._id
    )
    .select(
        "settings"
    );



    if(!user){

        return res.status(404).json({

            success:false,

            message:
            "User not found"

        });

    }




    res.status(200).json({

        success:true,

        data:
        user.settings || {}

    });


});








/*
=================================================
UPDATE ALL SETTINGS
PUT /api/settings
=================================================
*/

export const updateUserSettings =
asyncHandler(
async(req,res)=>{


    const settings =
    req.body;



    const user =
    await User.findById(
        req.user._id
    );



    if(!user){

        return res.status(404).json({

            success:false,

            message:
            "User not found"

        });

    }




    user.settings = {

        ...user.settings,

        ...settings

    };



    await user.save();




    res.status(200).json({

        success:true,

        message:
        "Settings updated successfully",

        data:
        user.settings

    });


});










/*
=================================================
CHANGE THEME
PUT /api/settings/theme
=================================================
*/

export const changeTheme =
asyncHandler(
async(req,res)=>{


    const {
        theme
    } = req.body;




    if(!theme){

        return res.status(400).json({

            success:false,

            message:
            "Theme required"

        });

    }





    const user =
    await User.findById(
        req.user._id
    );



    if(!user){

        return res.status(404).json({

            success:false,

            message:
            "User not found"

        });

    }





    user.settings = {

        ...user.settings,

        theme

    };




    await user.save();




    res.status(200).json({

        success:true,

        message:
        "Theme updated successfully",

        theme

    });



});









/*
=================================================
CHANGE EDITOR OPTIONS
PUT /api/settings/editor
=================================================
*/

export const changeEditorOptions =
asyncHandler(
async(req,res)=>{


    const editorOptions =
    req.body;




    const user =
    await User.findById(
        req.user._id
    );



    if(!user){

        return res.status(404).json({

            success:false,

            message:
            "User not found"

        });

    }




    user.settings = {


        ...user.settings,


        editor:{

            ...(user.settings?.editor || {}),

            ...editorOptions

        }


    };





    await user.save();





    res.status(200).json({

        success:true,

        message:
        "Editor settings updated successfully",

        editor:
        user.settings.editor

    });


});









/*
=================================================
RESET SETTINGS
DELETE /api/settings/reset
=================================================
*/

export const resetUserSettings =
asyncHandler(
async(req,res)=>{


    const user =
    await User.findById(
        req.user._id
    );



    if(!user){

        return res.status(404).json({

            success:false,

            message:
            "User not found"

        });

    }





    user.settings = {

        theme:"vs-dark",

        editor:{


            fontSize:16,


            tabSize:2,


            wordWrap:true,


            minimap:true


        }


    };





    await user.save();





    res.status(200).json({

        success:true,

        message:
        "Settings reset successfully",

        data:
        user.settings

    });


});