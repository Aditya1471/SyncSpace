import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";



/*
===================================================
REGISTER USER
===================================================
*/

export const register = async (userData) => {

    const {
        fullName,
        username,
        email,
        password
    } = userData;


    if(
        !fullName ||
        !username ||
        !email ||
        !password
    ){

        throw new Error(
            "All fields are required"
        );

    }



    const existingEmail =
    await User.findOne({
        email:
        email.toLowerCase()
    });



    if(existingEmail){

        throw new Error(
            "Email already exists"
        );

    }




    const existingUsername =
    await User.findOne({
        username:
        username.toLowerCase()
    });



    if(existingUsername){

        throw new Error(
            "Username already exists"
        );

    }





    const user =
    await User.create({

        fullName,

        username:
        username.toLowerCase(),

        email:
        email.toLowerCase(),

        password,

    });




    return {

        token:
        generateToken(
            user._id
        ),


        user:{
            id:user._id,

            fullName:user.fullName,

            username:user.username,

            email:user.email,

            avatar:user.avatar,

            role:user.role,
        }

    };


};






/*
===================================================
LOGIN USER
===================================================
*/

export const login = async ({
    email,
    password
})=>{


    if(
        !email ||
        !password
    ){

        throw new Error(
            "Email and password required"
        );

    }





    const user =
    await User.findOne({

        email:
        email.toLowerCase()

    })
    .select("+password");





    if(!user){

        throw new Error(
            "Invalid email or password"
        );

    }






    const isMatch =
    await user.matchPassword(
        password
    );





    if(!isMatch){

        throw new Error(
            "Invalid email or password"
        );

    }






    return {

        token:
        generateToken(
            user._id
        ),



        user:{

            id:user._id,

            fullName:user.fullName,

            username:user.username,

            email:user.email,

            avatar:user.avatar,

            role:user.role,

        }

    };


};







/*
===================================================
GET PROFILE
===================================================
*/


export const getProfile =
async(userId)=>{


    const user =
    await User.findById(
        userId
    )
    .select(
        "-password"
    );




    if(!user){

        throw new Error(
            "User not found"
        );

    }



    return user;

};









/*
===================================================
UPDATE PROFILE
===================================================
*/


export const updateProfile =
async(
    userId,
    data
)=>{


    const user =
    await User.findById(
        userId
    );




    if(!user){

        throw new Error(
            "User not found"
        );

    }





    if(data.fullName){

        user.fullName =
        data.fullName;

    }



    if(data.avatar){

        user.avatar =
        data.avatar;

    }



    if(data.bio){

        user.bio =
        data.bio;

    }



    if(data.github){

        user.github =
        data.github;

    }





    await user.save();




    return user;

};









/*
===================================================
CHANGE PASSWORD
===================================================
*/


export const changePassword =
async(
    userId,
    currentPassword,
    newPassword
)=>{


    const user =
    await User.findById(
        userId
    )
    .select("+password");





    if(!user){

        throw new Error(
            "User not found"
        );

    }





    const isMatch =
    await user.matchPassword(
        currentPassword
    );




    if(!isMatch){

        throw new Error(
            "Current password incorrect"
        );

    }





    user.password =
    newPassword;



    await user.save();



    return true;

};









/*
===================================================
DELETE ACCOUNT
===================================================
*/


export const deleteAccount =
async(userId)=>{


    const user =
    await User.findById(
        userId
    );




    if(!user){

        throw new Error(
            "User not found"
        );

    }





    await user.deleteOne();



    return true;

};









/*
===================================================
GET USER BY ID
===================================================
*/


export const getUserById =
async(userId)=>{


    return await User.findById(
        userId
    )
    .select(
        "-password"
    );


};









/*
===================================================
SET ONLINE
===================================================
*/


export const setOnline =
async(
    userId,
    socketId
)=>{


    const user =
    await User.findById(
        userId
    );



    if(user){

        user.isOnline = true;

        user.socketId =
        socketId;

        user.lastSeen =
        new Date();



        await user.save();

    }



};









/*
===================================================
SET OFFLINE
===================================================
*/


export const setOffline =
async(userId)=>{


    const user =
    await User.findById(
        userId
    );



    if(user){

        user.isOnline = false;

        user.socketId = null;

        user.lastSeen =
        new Date();



        await user.save();

    }


};