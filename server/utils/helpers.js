import crypto from "crypto";
import path from "path";





/*
====================================================
GENERATE RANDOM ID
====================================================
*/

export const generateId = (length = 8) => {


    return crypto
        .randomBytes(length)
        .toString("hex")
        .slice(0,length);


};







/*
====================================================
GENERATE ROOM ID
====================================================
*/

export const generateRoomId = () => {


    return (

        "ROOM-" +

        crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()

    );


};







/*
====================================================
CLEAN STRING
====================================================
*/

export const cleanString = (value)=>{


    if(!value)
        return "";


    return value
        .trim()
        .replace(
            /\s+/g,
            " "
        );


};







/*
====================================================
NORMALIZE EMAIL
====================================================
*/

export const normalizeEmail = (email)=>{


    return email
        ?.trim()
        .toLowerCase();


};







/*
====================================================
GET FILE EXTENSION
====================================================
*/

export const getFileExtension = (
    filename
)=>{


    return path
        .extname(filename)
        .replace(
            ".",
            ""
        );


};







/*
====================================================
CHECK ALLOWED FILE TYPE
====================================================
*/

export const isAllowedExtension = (
    filename,
    extensions=[]
)=>{


    const ext =
    getFileExtension(filename);



    return extensions.includes(
        ext.toLowerCase()
    );


};







/*
====================================================
FORMAT API RESPONSE
====================================================
*/

export const apiResponse = ({

    success=true,

    message="",

    data=null,

    error=null

})=>{


    return {

        success,

        message,

        data,

        error

    };


};







/*
====================================================
PAGINATION
====================================================
*/

export const pagination = (

    page=1,

    limit=20

)=>{


    const skip =
    (page-1) * limit;



    return {

        page:Number(page),

        limit:Number(limit),

        skip

    };


};







/*
====================================================
CHECK EMPTY OBJECT
====================================================
*/

export const isEmpty = (obj)=>{


    return Object.keys(obj)
    .length === 0;


};







/*
====================================================
SAFE FILE PATH
====================================================
*/

export const safePath = (
    filePath
)=>{


    return path
        .normalize(filePath)
        .replace(
            /^(\.\.[\/\\])+/, 
            ""
        );


};







/*
====================================================
FORMAT DATE
====================================================
*/

export const formatDate = (
    date
)=>{


    return new Date(date)
    .toISOString();


};







/*
====================================================
DELAY FUNCTION
====================================================
*/

export const delay = (
    ms
)=>{


    return new Promise(
        resolve =>
        setTimeout(
            resolve,
            ms
        )
    );


};