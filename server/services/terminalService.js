// server/services/terminalService.js

import { spawn } from "child_process";
import crypto from "crypto";



const terminalSessions = new Map();





/*
===================================================
CREATE TERMINAL SESSION
===================================================
*/

export const createSession = async({

    roomId,

    userId

})=>{


    const sessionId =
    crypto
    .randomBytes(8)
    .toString("hex");



    terminalSessions.set(

        sessionId,

        {

            sessionId,

            roomId,

            userId,

            history:[],

            process:null,

            createdAt:new Date()

        }

    );




    return {

        sessionId,

        roomId,

        userId

    };


};









/*
===================================================
GET SESSION
===================================================
*/

const getSession = async(sessionId)=>{


    const session =
    terminalSessions.get(
        sessionId
    );



    if(!session){

        throw new Error(
            "Terminal session not found"
        );

    }



    return session;


};









/*
===================================================
EXECUTE COMMAND
===================================================
*/

export const executeCommand = async({

    sessionId,

    command,

    roomId,

    userId

})=>{


    let session;



    if(sessionId){

        session =
        await getSession(
            sessionId
        );

    }

    else{


        session =
        await createSession({

            roomId,

            userId

        });


        session =
        await getSession(
            session.sessionId
        );


    }







    return new Promise(

        (resolve,reject)=>{


            const shell =
            process.platform === "win32"
            ? "cmd"
            : "bash";



            const args =
            process.platform === "win32"
            ? ["/c",command]
            : ["-c",command];





            const terminal =
            spawn(

                shell,

                args

            );




            let output="";

            let error="";





            terminal.stdout.on(

                "data",

                data=>{


                    output +=
                    data.toString();


                }

            );






            terminal.stderr.on(

                "data",

                data=>{


                    error +=
                    data.toString();


                }

            );








            terminal.on(

                "close",

                code=>{


                    const result={


                        command,


                        output,


                        error,


                        exitCode:code,


                        executionTime:
                        new Date()



                    };






                    session.history.push(

                        result

                    );






                    resolve(

                        result

                    );


                }

            );






            terminal.on(

                "error",

                err=>{


                    reject(err);


                }

            );






            session.process =
            terminal;



        }

    );


};









/*
===================================================
GET HISTORY
===================================================
*/

export const getHistory = async(roomId)=>{


    const history=[];



    for(

        const session

        of terminalSessions.values()

    ){


        if(

            session.roomId === roomId

        ){

            history.push(

                ...session.history

            );

        }


    }



    return history;


};









/*
===================================================
CLEAR HISTORY
===================================================
*/

export const clearHistory = async(roomId)=>{


    for(

        const session

        of terminalSessions.values()

    ){


        if(

            session.roomId === roomId

        ){


            session.history=[];


        }


    }



    return true;


};









/*
===================================================
CLOSE SESSION
===================================================
*/

export const closeSession = async(sessionId)=>{


    const session =
    terminalSessions.get(

        sessionId

    );




    if(!session){

        return false;

    }






    if(session.process){

        session.process.kill();

    }





    terminalSessions.delete(

        sessionId

    );





    return true;


};









/*
===================================================
GET ACTIVE TERMINALS
===================================================
*/

export const getActiveTerminals = async(roomId)=>{


    const active=[];




    for(

        const [

            id,

            session

        ]

        of terminalSessions

    ){



        if(

            session.roomId === roomId

        ){


            active.push({

                sessionId:id,

                userId:
                session.userId


            });


        }


    }



    return active;


};









export default {


    createSession,

    executeCommand,

    getHistory,

    clearHistory,

    closeSession,

    getActiveTerminals


};