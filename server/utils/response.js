/*
====================================================
SYNCSPACE API RESPONSE HANDLER
====================================================

Standard Response Format:

Success:

{
    success:true,
    message:"",
    data:{}
}


Error:

{
    success:false,
    message:"",
    error:""
}

====================================================
*/





/*
====================================================
SUCCESS RESPONSE
====================================================
*/

export const successResponse = (

    res,

    {

        statusCode = 200,

        message = "Success",

        data = null

    }

)=>{


    return res.status(
        statusCode
    )
    .json({

        success:true,

        message,

        data

    });


};







/*
====================================================
ERROR RESPONSE
====================================================
*/

export const errorResponse = (

    res,

    {

        statusCode = 500,

        message = "Internal Server Error",

        error = null

    }

)=>{


    return res.status(
        statusCode
    )
    .json({

        success:false,

        message,

        error

    });


};







/*
====================================================
PAGINATION RESPONSE
====================================================
*/

export const paginatedResponse = (

    res,

    {

        statusCode = 200,

        message = "Data fetched successfully",

        data = [],

        page = 1,

        limit = 20,

        total = 0

    }

)=>{


    return res.status(
        statusCode
    )
    .json({

        success:true,


        message,


        data,



        pagination:{


            page,


            limit,


            total,


            totalPages:
            Math.ceil(
                total / limit
            )

        }


    });


};







/*
====================================================
VALIDATION ERROR
====================================================
*/

export const validationError = (

    res,

    message =
    "Validation failed"

)=>{


    return res.status(
        400
    )
    .json({

        success:false,

        message

    });


};







/*
====================================================
NOT FOUND RESPONSE
====================================================
*/

export const notFoundResponse = (

    res,

    message =
    "Resource not found"

)=>{


    return res.status(
        404
    )
    .json({

        success:false,

        message

    });


};







/*
====================================================
UNAUTHORIZED RESPONSE
====================================================
*/

export const unauthorizedResponse = (

    res,

    message =
    "Unauthorized access"

)=>{


    return res.status(
        401
    )
    .json({

        success:false,

        message

    });


};