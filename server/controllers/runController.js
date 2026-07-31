import asyncHandler from "../utils/asyncHandler.js";

import {
    runCode
} from "../services/runnerService.js";





/*
===================================================
RUN CODE
POST /api/run
===================================================
*/

export const executeCode =
asyncHandler(
async(req,res)=>{


    const {

        language,

        code,

        input

    } = req.body;





    if(
        !language ||
        !code
    ){

        return res.status(400).json({

            success:false,

            message:
            "Language and code are required"

        });

    }





    const startTime =
    Date.now();





    const result =
    await runCode({

        language,

        code,

        input

    });





    const executionTime =
    Date.now()
    -
    startTime;





    res.status(200).json({

        success:
        result.success,


        output:
        result.output || "",


        error:
        result.error || "",


        executionTime:
        `${executionTime}ms`


    });


});