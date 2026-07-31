import Chat from "../models/Chat.js";





/*
====================================================
SYNCSPACE CHAT SOCKET
====================================================

Handles:

- Room chat
- Real-time messages
- Typing status
- User presence

====================================================
*/





const chatSocket = (io)=>{


    io.on(
        "connection",
        (socket)=>{


            console.log(
                "Chat Socket Connected:",
                socket.id
            );






            /*
            ========================================
            JOIN CHAT ROOM
            ========================================
            */


            socket.on(
                "join-chat",
                async(data)=>{


                    try{


                        const {
                            roomId,
                            username
                        } = data;




                        socket.join(
                            roomId
                        );




                        socket.username =
                        username;



                        socket.roomId =
                        roomId;





                        socket.to(roomId)
                        .emit(
                            "user-joined-chat",
                            {

                                username,

                                message:
                                `${username} joined the chat`

                            }
                        );





                        console.log(

                            `${username} joined ${roomId}`

                        );



                    }

                    catch(error){

                        console.error(
                            error.message
                        );

                    }


                }
            );









            /*
            ========================================
            SEND MESSAGE
            ========================================
            */


            socket.on(
                "send-message",
                async(data)=>{


                    try{


                        const {

                            roomId,

                            sender,

                            message


                        } = data;







                        const chat =
                        await Chat.create({

                            roomId,

                            sender,

                            message

                        });







                        io.to(roomId)
                        .emit(

                            "receive-message",

                            chat

                        );




                    }

                    catch(error){


                        console.error(

                            "Chat Error:",
                            error.message

                        );


                    }


                }
            );









            /*
            ========================================
            TYPING STATUS
            ========================================
            */


            socket.on(
                "typing",
                (data)=>{


                    socket.to(
                        data.roomId
                    )
                    .emit(

                        "user-typing",

                        {

                            username:
                            data.username

                        }

                    );


                }
            );









            /*
            ========================================
            STOP TYPING
            ========================================
            */


            socket.on(
                "stop-typing",
                (data)=>{


                    socket.to(
                        data.roomId
                    )
                    .emit(

                        "user-stop-typing",

                        {

                            username:
                            data.username

                        }

                    );


                }
            );









            /*
            ========================================
            LEAVE CHAT ROOM
            ========================================
            */


            socket.on(
                "leave-chat",
                (data)=>{


                    socket.leave(
                        data.roomId
                    );



                    socket.to(
                        data.roomId
                    )
                    .emit(

                        "user-left-chat",

                        {

                            username:
                            data.username

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


                    console.log(

                        "Chat Socket Disconnected:",
                        socket.id

                    );



                    if(
                        socket.roomId
                    ){


                        socket.to(
                            socket.roomId
                        )
                        .emit(

                            "user-offline",

                            {

                                username:
                                socket.username

                            }

                        );

                    }


                }
            );





        }
    );


};





export default chatSocket;