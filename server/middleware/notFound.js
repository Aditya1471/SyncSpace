/*
====================================================
404 NOT FOUND MIDDLEWARE
====================================================

Purpose:
- Handle invalid routes
- Return consistent API response

Must be placed AFTER all routes
and BEFORE errorHandler middleware

====================================================
*/





const notFound = (
    req,
    res,
    next
) => {


    const error = new Error(

        `Route not found: ${req.originalUrl}`

    );



    res.status(404);



    next(error);


};





export default notFound;