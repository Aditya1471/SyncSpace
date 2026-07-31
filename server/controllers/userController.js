// server/controllers/userController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";



/*
===================================================
GET CURRENT USER
GET /api/users/me
===================================================
*/

export const getCurrentUser = async (req, res) => {

    try {

        const user = await User.findById(
            req.user.id
        )
        .select("-password");


        if (!user) {

            return res.status(404).json({

                success:false,

                message:"User not found"

            });

        }


        res.status(200).json({

            success:true,

            user

        });


    } catch(error) {


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};







/*
===================================================
GET ALL USERS
GET /api/users
===================================================
*/

export const getUsers = async(req,res)=>{

    try{


        const users = await User.find()
        .select("-password");


        res.status(200).json({

            success:true,

            count:users.length,

            users

        });


    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};








/*
===================================================
SEARCH USERS
GET /api/users/search
===================================================
*/

export const searchUsers = async(req,res)=>{

    try{


        const query = req.query.query;


        if(!query){

            return res.status(400).json({

                success:false,

                message:"Search query required"

            });

        }



        const users = await User.find({

            $or:[

                {
                    username:{
                        $regex:query,
                        $options:"i"
                    }
                },

                {
                    fullName:{
                        $regex:query,
                        $options:"i"
                    }
                },

                {
                    email:{
                        $regex:query,
                        $options:"i"
                    }
                }

            ]

        })
        .select("-password");




        res.status(200).json({

            success:true,

            users

        });


    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};










/*
===================================================
UPDATE USER PROFILE
PUT /api/users/:id
===================================================
*/

export const updateUser = async(req,res)=>{

    try{


        const user =
        await User.findById(
            req.params.id
        );



        if(!user){

            return res.status(404).json({

                success:false,

                message:"User not found"

            });

        }




        const {

            fullName,

            username,

            bio,

            github

        } = req.body;




        if(fullName)
            user.fullName = fullName;



        if(username)
            user.username = username.toLowerCase();



        if(bio !== undefined)
            user.bio = bio;



        if(github !== undefined)
            user.github = github;





        await user.save();



        res.status(200).json({

            success:true,

            message:"User updated successfully",

            user

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};










/*
===================================================
UPDATE AVATAR
PUT /api/users/:id/avatar
===================================================
*/

export const updateAvatar = async(req,res)=>{


    try{


        const user =
        await User.findById(

            req.params.id

        );



        if(!user){

            return res.status(404).json({

                success:false,

                message:"User not found"

            });

        }




        user.avatar = req.body.avatar;



        await user.save();




        res.status(200).json({

            success:true,

            message:"Avatar updated successfully",

            avatar:user.avatar

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};










/*
===================================================
GET USER BY ID
GET /api/users/:id
===================================================
*/

export const getUserById = async(req,res)=>{


    try{


        const user =
        await User.findById(

            req.params.id

        )
        .select("-password");



        if(!user){


            return res.status(404).json({

                success:false,

                message:"User not found"

            });


        }



        res.status(200).json({

            success:true,

            user

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};










/*
===================================================
CHANGE PASSWORD
PUT /api/users/change-password
===================================================
*/

export const changePassword = async(req,res)=>{


    try{


        const {

            oldPassword,

            newPassword

        } = req.body;



        const user =
        await User.findById(
            req.user.id
        )
        .select("+password");



        if(!user){

            return res.status(404).json({

                success:false,

                message:"User not found"

            });

        }




        const match =
        await bcrypt.compare(

            oldPassword,

            user.password

        );



        if(!match){

            return res.status(400).json({

                success:false,

                message:"Old password incorrect"

            });

        }




        user.password =
        await bcrypt.hash(

            newPassword,

            10

        );



        await user.save();



        res.status(200).json({

            success:true,

            message:"Password changed successfully"

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};










/*
===================================================
DELETE USER
DELETE /api/users/:id
===================================================
*/

export const deleteUser = async(req,res)=>{


    try{


        const user =
        await User.findById(

            req.params.id

        );


        if(!user){

            return res.status(404).json({

                success:false,

                message:"User not found"

            });

        }



        await User.findByIdAndDelete(

            req.params.id

        );



        res.status(200).json({

            success:true,

            message:"User deleted successfully"

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};










/*
===================================================
DELETE OWN ACCOUNT
DELETE /api/users/account
===================================================
*/

export const deleteAccount = async(req,res)=>{


    try{


        await User.findByIdAndDelete(

            req.user.id

        );


        res.status(200).json({

            success:true,

            message:"Account deleted successfully"

        });


    }
    catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


};