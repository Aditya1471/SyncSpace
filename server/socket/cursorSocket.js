import { SOCKET_EVENTS } from "../utils/constants.js";





/*
====================================================
SYNCSPACE CURSOR SOCKET
====================================================

Handles:

- User cursor position
- Text selection
- Multi-user editor presence

Used with:

- Monaco Editor
- Socket.IO

====================================================
*/





const cursorSocket = (io)=>{


    io.on(
        "connection",
        (socket)=>{





            /*
            ========================================
            JOIN EDITOR ROOM
            ========================================
            */


            socket.on(
                "join-editor-room",
                (data)=>{


                    const {

                        roomId,

                        userId,

                        username,

                        color

                    } = data;





                    socket.join(
                        roomId
                    );




                    socket.cursorData = {

                        roomId,

                        userId,

                        username,

                        color

                    };





                    socket.to(roomId)
                    .emit(

                        "cursor-user-joined",

                        {

                            userId,

                            username,

                            color

                        }

                    );





                }
            );









            /*
            ========================================
            CURSOR MOVE EVENT
            ========================================
            */


            socket.on(

                "cursor-move",

                (data)=>{


                    const {


                        roomId,

                        position,

                        selection


                    } = data;





                    socket.to(roomId)
                    .emit(

                        "cursor-update",

                        {

                            userId:
                            socket.cursorData?.userId,


                            username:
                            socket.cursorData?.username,


                            color:
                            socket.cursorData?.color,


                            position,


                            selection

                        }

                    );



                }

            );









            /*
            ========================================
            TEXT SELECTION CHANGE
            ========================================
            */


            socket.on(

                "selection-change",

                (data)=>{


                    socket.to(
                        data.roomId
                    )
                    .emit(

                        "selection-update",

                        {

                            userId:
                            socket.cursorData?.userId,


                            username:
                            socket.cursorData?.username,


                            selection:
                            data.selection

                        }

                    );


                }

            );









            /*
            ========================================
            REQUEST ACTIVE CURSORS
            ========================================
            */


            socket.on(

                "request-cursors",

                (roomId)=>{


                    socket.to(
                        roomId
                    )
                    .emit(

                        "cursor-request",

                        {

                            requester:
                            socket.id

                        }

                    );


                }

            );









            /*
            ========================================
            CURSOR DISCONNECT
            ========================================
            */


            socket.on(

                "disconnect",

                ()=>{


                    if(
                        socket.cursorData
                    ){


                        socket.to(

                            socket.cursorData.roomId

                        )
                        .emit(

                            "cursor-user-left",

                            {

                                userId:
                                socket.cursorData.userId,


                                username:
                                socket.cursorData.username

                            }

                        );


                    }


                }

            );




        }
    );


};





export default cursorSocket;