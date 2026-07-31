import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";



/*
===================================================
USER RESPONSE FORMATTER
===================================================
*/

const userResponse = (user)=>{

    return {

        id:user._id,

        fullName:user.fullName,

        username:user.username,

        email:user.email,

        avatar:user.avatar,

        bio:user.bio,

        github:user.github,

        role:user.role,

        createdAt:user.createdAt

    };

};









/*
===================================================
SIGNUP
POST /api/auth/signup
===================================================
*/

export const signup =
asyncHandler(
async(req,res)=>{


    const {

        fullName,

        username,

        email,

        password

    } = req.body;





    if(
        !fullName ||
        !username ||
        !email ||
        !password
    ){

        return res.status(400).json({

            success:false,

            message:
            "All fields are required"

        });

    }





    const normalizedEmail =
    email
    .trim()
    .toLowerCase();



    const normalizedUsername =
    username
    .trim()
    .toLowerCase();





    const emailExists =
    await User.findOne({

        email:
        normalizedEmail

    });





    if(emailExists){

        return res.status(409).json({

            success:false,

            message:
            "Email already registered"

        });

    }







    const usernameExists =
    await User.findOne({

        username:
        normalizedUsername

    });





    if(usernameExists){

        return res.status(409).json({

            success:false,

            message:
            "Username already taken"

        });

    }





    const user =
    await User.create({

        fullName:
        fullName.trim(),

        username:
        normalizedUsername,

        email:
        normalizedEmail,

        password

    });





    const token =
    generateToken(
        user._id
    );





    res.status(201).json({

        success:true,

        message:
        "Account created successfully",

        token,

        user:
        userResponse(user)

    });


});









/*
===================================================
LOGIN
POST /api/auth/login
===================================================
*/

export const login =
asyncHandler(
async(req,res)=>{


    const {

        email,

        password

    } = req.body;





    if(
        !email ||
        !password
    ){

        return res.status(400).json({

            success:false,

            message:
            "Email and password required"

        });

    }





    const user =
    await User.findOne({

        email:
        email
        .trim()
        .toLowerCase()

    })
    .select(
        "+password"
    );





    if(!user){

        return res.status(401).json({

            success:false,

            message:
            "Invalid email or password"

        });

    }





    const match =
    await user.matchPassword(
        password
    );





    if(!match){

        return res.status(401).json({

            success:false,

            message:
            "Invalid email or password"

        });

    }





    const token =
    generateToken(
        user._id
    );





    res.status(200).json({

        success:true,

        message:
        "Login successful",

        token,

        user:
        userResponse(user)

    });


});









/*
===================================================
GET PROFILE
GET /api/auth/profile
===================================================
*/

export const getProfile =
asyncHandler(
async(req,res)=>{


    const user =
    await User.findById(
        req.user._id
    )
    .select(
        "-password"
    );





    res.status(200).json({

        success:true,

        user

    });


});









/*
===================================================
UPDATE PROFILE
PUT /api/auth/profile
===================================================
*/

export const updateProfile =
asyncHandler(
async(req,res)=>{


    const {

        fullName,

        username,

        bio,

        github,

        avatar

    } = req.body;





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





    if(fullName)
        user.fullName =
        fullName;



    if(username)
        user.username =
        username;



    if(bio !== undefined)
        user.bio =
        bio;



    if(github !== undefined)
        user.github =
        github;



    if(avatar)
        user.avatar =
        avatar;





    await user.save();





    res.status(200).json({

        success:true,

        message:
        "Profile updated successfully",

        user:
        userResponse(user)

    });


});









/*
===================================================
CHANGE PASSWORD
PUT /api/auth/password
===================================================
*/

export const changePassword =
asyncHandler(
async(req,res)=>{


    const {

        currentPassword,

        newPassword

    } = req.body;





    if(
        !currentPassword ||
        !newPassword
    ){

        return res.status(400).json({

            success:false,

            message:
            "Password fields required"

        });

    }





    const user =
    await User.findById(
        req.user._id
    )
    .select(
        "+password"
    );





    const match =
    await user.matchPassword(
        currentPassword
    );





    if(!match){

        return res.status(400).json({

            success:false,

            message:
            "Current password incorrect"

        });

    }





    user.password =
    newPassword;



    await user.save();





    res.status(200).json({

        success:true,

        message:
        "Password changed successfully"

    });


});









/*
===================================================
DELETE ACCOUNT
DELETE /api/auth/account
===================================================
*/

export const deleteAccount =
asyncHandler(
async(req,res)=>{


    await User.findByIdAndDelete(

        req.user._id

    );





    res.status(200).json({

        success:true,

        message:
        "Account deleted successfully"

    });


});









/*
===================================================
LOGOUT
POST /api/auth/logout
===================================================
*/

export const logout =
asyncHandler(
async(req,res)=>{


    res.status(200).json({

        success:true,

        message:
        "Logout successful"

    });


});









/*
===================================================
REFRESH TOKEN
POST /api/auth/refresh
===================================================
*/

export const refreshToken =
asyncHandler(
async(req,res)=>{


    const token =
    generateToken(
        req.user._id
    );





    res.status(200).json({

        success:true,

        token

    });


});