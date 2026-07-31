import asyncHandler from "../utils/asyncHandler.js";

import {
    createSession,
    executeCommand,
    getHistory,
    clearHistory,
    closeSession
} from "../services/terminalService.js";



/*
===================================================
CREATE TERMINAL SESSION
POST /api/terminal/:roomId/session
===================================================
*/

export const createTerminalSession =
asyncHandler(async(req,res)=>{


    const session =
    await createSession({

        roomId:req.params.roomId,

        userId:req.user?._id

    });



    res.status(201).json({

        success:true,

        message:
        "Terminal session created",

        data:session

    });


});









/*
===================================================
RUN TERMINAL COMMAND
POST /api/terminal/:roomId/execute
===================================================
*/

export const executeTerminalCommand =
asyncHandler(async(req,res)=>{


    const {

        command,

        sessionId

    } = req.body;




    if(!command){

        return res.status(400).json({

            success:false,

            message:
            "Command is required"

        });

    }





    const result =
    await executeCommand({

        roomId:req.params.roomId,

        command,

        sessionId,

        userId:req.user?._id

    });





    res.status(200).json({

        success:true,

        message:
        "Command executed",

        data:{

            command:
            result.command,


            output:
            result.output,


            error:
            result.error,


            executionTime:
            result.executionTime

        }

    });


});









/*
===================================================
GET TERMINAL HISTORY
GET /api/terminal/:roomId/history
===================================================
*/

export const getTerminalHistory =
asyncHandler(async(req,res)=>{


    const history =
    await getHistory(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        count:
        history.length,

        data:history

    });


});









/*
===================================================
CLEAR TERMINAL HISTORY
DELETE /api/terminal/:roomId/history
===================================================
*/

export const removeTerminalHistory =
asyncHandler(async(req,res)=>{


    await clearHistory(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        message:
        "Terminal history cleared"

    });


});









/*
===================================================
CLOSE TERMINAL SESSION
DELETE /api/terminal/session/:sessionId
===================================================
*/

export const closeTerminalSession =
asyncHandler(async(req,res)=>{


    await closeSession(

        req.params.sessionId

    );





    res.status(200).json({

        success:true,

        message:
        "Terminal session closed"

    });


});