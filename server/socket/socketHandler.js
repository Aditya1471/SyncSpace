import roomSocket from "./roomSocket.js";
import chatSocket from "./chatSocket.js";
import editorSocket from "./editorSocket.js";
import cursorSocket from "./cursorSocket.js";
import presenceSocket from "./presenceSocket.js";





/*
====================================================
SYNCSPACE SOCKET HANDLER
====================================================

Main Socket.IO Manager

Handles:

- Rooms
- Chat
- Editor
- Cursor
- Presence
- Whiteboard
- Terminal

====================================================
*/





const socketHandler = (io) => {




    console.log(
        "Initializing SyncSpace Socket System..."
    );





    /*
    ================================================
    ROOM MANAGEMENT
    ================================================
    */


    roomSocket(io);







    /*
    ================================================
    CHAT SYSTEM
    ================================================
    */


    chatSocket(io);







    /*
    ================================================
    CODE EDITOR
    ================================================
    */


    editorSocket(io);







    /*
    ================================================
    CURSOR SYSTEM
    ================================================
    */


    cursorSocket(io);







    /*
    ================================================
    USER PRESENCE
    ================================================
    */


    presenceSocket(io);








    /*
    ================================================
    GLOBAL CONNECTION HANDLER
    ================================================
    */


    io.on(

        "connection",

        (socket)=>{


            console.log(

                `🟢 Connected: ${socket.id}`

            );







            /*
            ========================================
            WHITEBOARD EVENTS
            ========================================
            */


            socket.on(

                "canvas-draw",

                (data)=>{


                    socket.to(

                        data.roomId

                    )
                    .emit(

                        "canvas-draw",

                        data.drawData

                    );


                }

            );







            socket.on(

                "canvas-clear",

                (data)=>{


                    socket.to(

                        data.roomId

                    )
                    .emit(

                        "canvas-clear"

                    );


                }

            );









            /*
            ========================================
            CHAT EVENTS
            ========================================
            */

            socket.on(
                "chat-message",
                (data)=>{
                    io.to(data.roomId).emit("chat-message", {
                        username: data.username,
                        message: data.message,
                        time: new Date().toISOString()
                    });
                }
            );

            /*
            ========================================
            TERMINAL EVENTS READY
            ========================================
            */


            socket.on(

                "terminal-output",

                (data)=>{


                    socket.to(

                        data.roomId

                    )
                    .emit(

                        "terminal-output",

                        data.output

                    );


                }

            );








            /*
            ========================================
            GLOBAL DISCONNECT
            ========================================
            */


            socket.on(

                "disconnect",

                ()=>{


                    console.log(

                        `🔴 Disconnected: ${socket.id}`

                    );


                }

            );



        }

    );







    console.log(
        "✅ SyncSpace Socket System Ready"
    );


};





export default socketHandler;