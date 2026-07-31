import multer from "multer";
import path from "path";





/*
====================================================
UPLOAD MIDDLEWARE
====================================================

Used for:

- Profile avatar upload
- Workspace files
- Project uploads
- Attachments

====================================================
*/





/*
====================================================
STORAGE CONFIGURATION
====================================================
*/


const storage =
multer.diskStorage({

    destination:(req,file,cb)=>{


        cb(
            null,
            "uploads/"
        );


    },


    filename:(req,file,cb)=>{


        const uniqueName =

            Date.now()
            +
            "-"
            +
            Math.round(
                Math.random()*1E9
            )
            +
            path.extname(
                file.originalname
            );



        cb(
            null,
            uniqueName
        );


    }

});







/*
====================================================
FILE FILTER
====================================================
*/


const fileFilter = (

    req,

    file,

    cb

)=>{


    const allowedTypes = [

        "image/jpeg",

        "image/png",

        "image/jpg",

        "image/webp",

        "text/plain",

        "text/javascript",

        "application/javascript",

        "application/json",

        "text/css",

        "text/html",

        "application/pdf"

    ];





    if(
        allowedTypes.includes(
            file.mimetype
        )
    ){


        cb(
            null,
            true
        );


    }

    else{


        cb(

            new Error(
                "File type not supported"
            ),

            false

        );


    }


};







/*
====================================================
MULTER CONFIG
====================================================
*/


const upload = multer({

    storage,


    fileFilter,



    limits:{


        fileSize:
        50 * 1024 * 1024
        // 50 MB


    }

});







/*
====================================================
EXPORT METHODS
====================================================
*/


export const uploadSingle =
upload.single(
    "file"
);




export const uploadMultiple =
upload.array(
    "files",
    10
);




export const uploadAvatar =
upload.single(
    "avatar"
);





export default upload;