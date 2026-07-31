import { body, validationResult } from "express-validator";





/*
====================================================
ROOM VALIDATION MIDDLEWARE
====================================================

Used for:

POST /api/rooms

Validates:

- roomId
- roomName
- createdBy

====================================================
*/





const validateRoom = [



    /*
    ================================================
    ROOM ID VALIDATION
    ================================================
    */


    body("roomId")

        .trim()

        .notEmpty()

        .withMessage(
            "Room ID is required"
        )


        .isLength({

            min:3,

            max:20

        })

        .withMessage(
            "Room ID must be between 3 and 20 characters"
        )


        .matches(
            /^[A-Za-z0-9_-]+$/
        )

        .withMessage(
            "Room ID can contain only letters, numbers, _ and -"
        ),







    /*
    ================================================
    ROOM NAME VALIDATION
    ================================================
    */


    body("roomName")

        .trim()

        .notEmpty()

        .withMessage(
            "Room name is required"
        )


        .isLength({

            min:3,

            max:50

        })

        .withMessage(
            "Room name must be between 3 and 50 characters"
        ),







    /*
    ================================================
    CREATED BY VALIDATION
    ================================================
    */


    body("createdBy")

        .optional()

        .trim()

        .isLength({

            min:2,

            max:50

        })

        .withMessage(
            "Creator name must be between 2 and 50 characters"
        ),







    /*
    ================================================
    VALIDATION RESULT
    ================================================
    */


    (req,res,next)=>{


        const errors =
        validationResult(req);




        if(
            !errors.isEmpty()
        ){


            return res.status(400)
            .json({

                success:false,


                message:
                "Room validation failed",



                errors:
                errors.array().map(
                    error=>({

                        field:
                        error.path,


                        message:
                        error.msg

                    })
                )

            });


        }





        next();


    }


];





export default validateRoom;