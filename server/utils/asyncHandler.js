/*
===================================================
ASYNC ERROR HANDLER
===================================================

Purpose:
- Avoid repeating try/catch in every controller
- Automatically forward errors to Express error middleware

Usage:

export const controller =
asyncHandler(async(req,res)=>{

    // your code

});

===================================================
*/


const asyncHandler = (fn) => {

    return (req, res, next) => {

        Promise
            .resolve(
                fn(req, res, next)
            )
            .catch(
                next
            );

    };

};



export default asyncHandler;