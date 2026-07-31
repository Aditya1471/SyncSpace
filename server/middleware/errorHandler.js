import logger from "../utils/logger.js";





/*
====================================================
GLOBAL ERROR HANDLER
====================================================

Handles:

- Controller errors
- MongoDB errors
- JWT errors
- Validation errors
- Server errors

====================================================
*/





const errorHandler = (

    err,

    req,

    res,

    next

) => {



    /*
    ================================================
    LOG ERROR
    ================================================
    */


    logger.error(
        err.message,
        {
            stack:
            err.stack,

            url:
            req.originalUrl,

            method:
            req.method

        }
    );







    let statusCode =
    err.statusCode || 500;



    let message =
    err.message ||
    "Internal Server Error";








    /*
    ================================================
    INVALID MONGODB OBJECT ID
    ================================================
    */


    if(
        err.name === "CastError"
    ){

        statusCode = 400;


        message =
        "Invalid resource ID";

    }








    /*
    ================================================
    DUPLICATE MONGODB KEY ERROR
    ================================================
    */


    if(
        err.code === 11000
    ){


        statusCode = 409;



        const field =
        Object.keys(
            err.keyValue || {}
        )[0];



        message =
        `${field || "Data"} already exists`;

    }








    /*
    ================================================
    MONGOOSE VALIDATION ERROR
    ================================================
    */


    if(
        err.name === "ValidationError"
    ){


        statusCode = 400;



        message =
        Object.values(
            err.errors
        )
        .map(
            error =>
            error.message
        )
        .join(", ");


    }








    /*
    ================================================
    JWT ERRORS
    ================================================
    */


    if(
        err.name === "JsonWebTokenError"
    ){

        statusCode = 401;


        message =
        "Invalid authentication token";

    }






    if(
        err.name === "TokenExpiredError"
    ){

        statusCode = 401;


        message =
        "Authentication token expired";

    }








    /*
    ================================================
    JSON PARSE ERROR
    ================================================
    */


    if(
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ){

        statusCode = 400;


        message =
        "Invalid JSON format";

    }








    /*
    ================================================
    RESPONSE
    ================================================
    */


    res.status(
        statusCode
    )
    .json({

        success:false,


        message,



        ...(process.env.NODE_ENV === "development" && {

            stack:
            err.stack

        })

    });


};





export default errorHandler;