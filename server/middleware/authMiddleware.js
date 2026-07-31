import jwt from "jsonwebtoken";
import User from "../models/User.js";





/*
====================================================
PROTECT ROUTE MIDDLEWARE
====================================================

Purpose:
- Verify JWT token
- Attach logged-in user to req.user

Usage:

router.get(
    "/profile",
    protect,
    controller
)

====================================================
*/





export const protect = async (
    req,
    res,
    next
) => {


    try {


        let token;




        /*
        ============================================
        GET TOKEN FROM HEADER
        ============================================
        */


        const authHeader =
        req.headers.authorization;



        if(
            authHeader &&
            authHeader.startsWith("Bearer ")
        ){

            token =
            authHeader.split(" ")[1];

        }





        if(!token){


            return res.status(401).json({

                success:false,

                message:
                "Access denied. Token missing."

            });


        }






        /*
        ============================================
        VERIFY JWT
        ============================================
        */


        const decoded =
        jwt.verify(

            token,

            process.env.JWT_SECRET

        );







        /*
        ============================================
        FIND USER
        ============================================
        */


        const user =
        await User
        .findById(
            decoded.id
        )
        .select(
            "-password"
        );






        if(!user){


            return res.status(401).json({

                success:false,

                message:
                "User account not found."

            });


        }






        req.user = user;



        next();





    }

    catch(error){


        console.error(
            "Auth Middleware Error:",
            error.message
        );



        if(
            error.name === "TokenExpiredError"
        ){

            return res.status(401).json({

                success:false,

                message:
                "Token expired. Please login again."

            });


        }




        if(
            error.name === "JsonWebTokenError"
        ){

            return res.status(401).json({

                success:false,

                message:
                "Invalid authentication token."

            });


        }





        return res.status(500).json({

            success:false,

            message:
            "Authentication failed."

        });


    }


};







/*
====================================================
ADMIN MIDDLEWARE
====================================================

Usage:

router.delete(
 "/user/:id",
 protect,
 admin,
 controller
)

====================================================
*/


export const admin = (

    req,

    res,

    next

)=>{


    if(
        req.user &&
        req.user.role === "admin"
    ){


        next();


    }

    else{


        return res.status(403).json({

            success:false,

            message:
            "Admin access required."

        });


    }


};







/*
====================================================
OPTIONAL AUTH
====================================================

Allows both:
- Logged users
- Guests

====================================================
*/


export const optionalAuth = async (

    req,

    res,

    next

)=>{


    try{


        const token =
        req.headers.authorization
        ?.split(" ")[1];



        if(!token){

            return next();

        }




        const decoded =
        jwt.verify(

            token,

            process.env.JWT_SECRET

        );




        req.user =
        await User
        .findById(
            decoded.id
        )
        .select(
            "-password"
        );



        next();


    }

    catch(error){


        next();


    }


};