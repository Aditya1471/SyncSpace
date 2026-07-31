import jwt from "jsonwebtoken";





/*
====================================================
JWT TOKEN GENERATOR
====================================================

Used in:

- Signup
- Login
- Refresh Token

====================================================
*/





const generateToken = (userId) => {


    if(!process.env.JWT_SECRET){

        throw new Error(
            "JWT_SECRET is not defined"
        );

    }





    const token =
    jwt.sign(

        {
            id: userId

        },


        process.env.JWT_SECRET,


        {

            expiresIn:
            process.env.JWT_EXPIRE || "7d"

        }

    );





    return token;


};





export default generateToken;