import chatSocket from "./chatSocket.js";
import editorSocket from "./editorSocket.js";
import cursorSocket from "./cursorSocket.js";





/*
====================================================
SYNCSPACE SOCKET INITIALIZER
====================================================

Purpose:

- Register all socket modules
- Maintain clean server.js
- Central socket management

Usage:

initializeSocket(io);

====================================================
*/





const initializeSocket = (io)=>{


    console.log(
        "Initializing Socket.IO..."
    );





    /*
    ================================================
    CHAT SOCKET
    ================================================
    */


    chatSocket(io);







    /*
    ================================================
    EDITOR SOCKET
    ================================================
    */


    editorSocket(io);







    /*
    ================================================
    CURSOR SOCKET
    ================================================
    */


    cursorSocket(io);







    /*
    ================================================
    CONNECTION LOGGER
    ================================================
    */


    io.on(

        "connection",

        (socket)=>{


            console.log(

                "Socket Connected:",
                socket.id

            );




            socket.on(

                "disconnect",

                ()=>{


                    console.log(

                        "Socket Disconnected:",
                        socket.id

                    );


                }

            );



        }

    );






    console.log(
        "Socket.IO Ready"
    );


};





export default initializeSocket;