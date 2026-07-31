import terminalService from "../services/terminalService.js";





/*
====================================================
SYNCSPACE TERMINAL SOCKET
====================================================

Handles:

- Shared terminal
- Commands
- Output streaming
- Terminal status

Used with:

- xterm.js
- Socket.IO

====================================================
*/





const terminalSocket = (io)=>{


    io.on(

        "connection",

        (socket)=>{



            console.log(

                "Terminal Socket Connected:",
                socket.id

            );







            /*
            ========================================
            JOIN TERMINAL SESSION
            ========================================
            */


            socket.on(

                "join-terminal",

                (data)=>{


                    const {

                        roomId,

                        username

                    } = data;





                    socket.join(
                        roomId
                    );





                    socket.terminalData = {

                        roomId,

                        username

                    };






                    socket.to(roomId)
                    .emit(

                        "terminal-user-joined",

                        {

                            username

                        }

                    );




                }

            );









            /*
            ========================================
            EXECUTE COMMAND
            ========================================
            */


            socket.on(

                "terminal-command",

                async(data)=>{


                    try{


                        const {

                            roomId,

                            command,

                            cwd

                        } = data;







                        io.to(roomId)
                        .emit(

                            "terminal-output",

                            {

                                type:
                                "command",


                                command,


                                username:
                                socket.terminalData
                                ?.username


                            }

                        );









                        const result =
                        await terminalService.executeCommand({

                            command,

                            cwd

                        });







                        io.to(roomId)
                        .emit(

                            "terminal-output",

                            {

                                type:
                                "output",


                                output:
                                result.output || "",


                                error:
                                result.error || null


                            }

                        );





                    }

                    catch(error){


                        socket.emit(

                            "terminal-error",

                            {

                                message:
                                error.message

                            }

                        );


                    }


                }

            );









            /*
            ========================================
            TERMINAL RESIZE
            ========================================
            */


            socket.on(

                "terminal-resize",

                (data)=>{


                    socket.to(

                        data.roomId

                    )
                    .emit(

                        "terminal-resize",

                        {

                            cols:
                            data.cols,


                            rows:
                            data.rows

                        }

                    );


                }

            );









            /*
            ========================================
            CLEAR TERMINAL
            ========================================
            */


            socket.on(

                "terminal-clear",

                (data)=>{


                    io.to(

                        data.roomId

                    )
                    .emit(

                        "terminal-clear"

                    );


                }

            );









            /*
            ========================================
            TERMINAL INPUT STREAM
            ========================================
            */


            socket.on(

                "terminal-input",

                (data)=>{


                    socket.to(

                        data.roomId

                    )
                    .emit(

                        "terminal-input",

                        {

                            input:
                            data.input

                        }

                    );


                }

            );









            /*
            ========================================
            DISCONNECT
            ========================================
            */


            socket.on(

                "disconnect",

                ()=>{


                    if(
                        socket.terminalData
                    ){


                        socket.to(

                            socket.terminalData.roomId

                        )
                        .emit(

                            "terminal-user-left",

                            {

                                username:
                                socket.terminalData.username

                            }

                        );


                    }




                    console.log(

                        "Terminal Socket Disconnected:",
                        socket.id

                    );


                }

            );




        }

    );


};





export default terminalSocket;