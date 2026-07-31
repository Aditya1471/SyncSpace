import User from "../models/User.js";





/*
====================================================
SYNCSPACE PRESENCE SOCKET
====================================================

Handles:

- Online users
- Offline users
- Room presence
- Active participants

====================================================
*/





const onlineUsers = new Map();







const presenceSocket = (io)=>{


    io.on(

        "connection",

        (socket)=>{



            console.log(

                "Presence Socket Connected:",
                socket.id

            );







            /*
            ========================================
            USER ONLINE
            ========================================
            */


            socket.on(

                "user-online",

                async(data)=>{


                    try{


                        const {

                            userId,

                            username,

                            roomId

                        } = data;







                        onlineUsers.set(

                            socket.id,

                            {

                                userId,

                                username,

                                roomId,

                                socketId:
                                socket.id,


                                onlineAt:
                                new Date()

                            }

                        );







                        socket.join(
                            roomId
                        );






                        io.to(roomId)
                        .emit(

                            "presence-update",

                            {

                                type:
                                "online",


                                userId,


                                username,


                                socketId:
                                socket.id

                            }

                        );







                        const activeUsers =
                        getRoomUsers(
                            roomId
                        );





                        io.to(roomId)
                        .emit(

                            "active-users",

                            activeUsers

                        );



                    }

                    catch(error){


                        console.error(

                            "Presence Error:",
                            error.message

                        );


                    }


                }

            );









            /*
            ========================================
            GET ACTIVE USERS
            ========================================
            */


            socket.on(

                "get-active-users",

                (roomId)=>{


                    socket.emit(

                        "active-users",

                        getRoomUsers(
                            roomId
                        )

                    );


                }

            );









            /*
            ========================================
            USER STATUS CHANGE
            ========================================
            */


            socket.on(

                "change-status",

                (data)=>{


                    const user =
                    onlineUsers.get(
                        socket.id
                    );




                    if(user){


                        user.status =
                        data.status;



                        onlineUsers.set(

                            socket.id,

                            user

                        );



                        io.to(
                            user.roomId
                        )
                        .emit(

                            "status-changed",

                            {

                                username:
                                user.username,


                                status:
                                data.status

                            }

                        );


                    }


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


                    const user =
                    onlineUsers.get(
                        socket.id
                    );






                    if(user){


                        onlineUsers.delete(
                            socket.id
                        );






                        io.to(
                            user.roomId
                        )
                        .emit(

                            "presence-update",

                            {

                                type:
                                "offline",


                                userId:
                                user.userId,


                                username:
                                user.username,


                                lastSeen:
                                new Date()

                            }

                        );






                        io.to(
                            user.roomId
                        )
                        .emit(

                            "active-users",

                            getRoomUsers(
                                user.roomId
                            )

                        );



                    }






                    console.log(

                        "Presence Disconnected:",
                        socket.id

                    );


                }

            );





        }

    );


};







/*
====================================================
GET USERS BY ROOM
====================================================
*/


const getRoomUsers = (

    roomId

)=>{


    const users = [];



    onlineUsers.forEach(

        (user)=>{


            if(
                user.roomId === roomId
            ){

                users.push({

                    userId:
                    user.userId,


                    username:
                    user.username,


                    socketId:
                    user.socketId,


                    status:
                    user.status ||
                    "online"

                });


            }


        }

    );



    return users;


};





export default presenceSocket;