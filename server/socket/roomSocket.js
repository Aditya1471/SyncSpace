import Room from "../models/Room.js";





/*
====================================================
SYNCSPACE ROOM SOCKET
====================================================

Handles:

- Room joining
- Room leaving
- Participants
- Room events

====================================================
*/





const activeRooms = new Map();







const roomSocket = (io)=>{


    io.on(

        "connection",

        (socket)=>{



            console.log(

                "Room Socket Connected:",
                socket.id

            );







            /*
            ========================================
            JOIN ROOM
            ========================================
            */


            socket.on(

                "join-room",

                async(data)=>{


                    try{


                        const {

                            roomId,

                            userId,

                            username

                        } = data;







                        socket.join(
                            roomId
                        );






                        socket.roomId =
                        roomId;



                        socket.userData = {

                            userId,

                            username

                        };







                        if(
                            !activeRooms.has(roomId)
                        ){


                            activeRooms.set(

                                roomId,

                                []

                            );


                        }







                        const users =
                        activeRooms.get(
                            roomId
                        );







                        const exists =
                        users.find(

                            user =>
                            user.socketId === socket.id

                        );






                        if(!exists){


                            users.push({

                                socketId:
                                socket.id,


                                userId,


                                username


                            });


                        }







                        activeRooms.set(

                            roomId,

                            users

                        );








                        await Room.findOneAndUpdate(

                            {

                                roomId

                            },


                            {

                                $addToSet:{

                                    participants:
                                    username

                                },


                                lastActivity:
                                new Date()


                            }

                        );









                        io.to(roomId)
                        .emit(

                            "room-users",

                            users

                        );






                        socket.to(roomId)
                        .emit(

                            "room-notification",

                            {

                                message:
                                `${username} joined the room`

                            }

                        );




                    }

                    catch(error){


                        console.error(

                            "Join Room Socket Error:",
                            error.message

                        );


                    }


                }

            );









            /*
            ========================================
            LEAVE ROOM
            ========================================
            */


            socket.on(

                "leave-room",

                async()=>{


                    try{


                        const roomId =
                        socket.roomId;



                        const username =
                        socket.userData?.username;






                        if(
                            !roomId
                        )
                        return;






                        socket.leave(
                            roomId
                        );






                        removeUser(
                            roomId,
                            socket.id
                        );







                        await Room.findOneAndUpdate(

                            {

                                roomId

                            },


                            {

                                $pull:{

                                    participants:
                                    username

                                },


                                lastActivity:
                                new Date()


                            }

                        );







                        io.to(roomId)
                        .emit(

                            "room-users",

                            activeRooms.get(
                                roomId
                            ) || []

                        );







                        io.to(roomId)
                        .emit(

                            "room-notification",

                            {

                                message:
                                `${username} left the room`

                            }

                        );



                    }

                    catch(error){


                        console.error(

                            "Leave Room Error:",
                            error.message

                        );


                    }


                }

            );









            /*
            ========================================
            GET ROOM USERS
            ========================================
            */


            socket.on(

                "get-room-users",

                (roomId)=>{


                    socket.emit(

                        "room-users",

                        activeRooms.get(
                            roomId
                        ) || []

                    );


                }

            );









            /*
            ========================================
            ROOM MESSAGE / ACTIVITY
            ========================================
            */


            socket.on(

                "room-activity",

                (data)=>{


                    socket.to(

                        data.roomId

                    )
                    .emit(

                        "room-activity",

                        {

                            username:
                            socket.userData?.username,


                            action:
                            data.action

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


                    const roomId =
                    socket.roomId;



                    if(roomId){


                        removeUser(

                            roomId,

                            socket.id

                        );







                        io.to(roomId)
                        .emit(

                            "room-users",

                            activeRooms.get(
                                roomId
                            ) || []

                        );


                    }






                    console.log(

                        "Room Socket Disconnected:",
                        socket.id

                    );


                }

            );





        }

    );


};









/*
====================================================
REMOVE USER FROM ROOM
====================================================
*/


const removeUser = (

    roomId,

    socketId

)=>{


    if(
        !activeRooms.has(roomId)
    )
    return;





    let users =
    activeRooms.get(
        roomId
    );





    users =
    users.filter(

        user =>
        user.socketId !== socketId

    );





    if(
        users.length === 0
    ){


        activeRooms.delete(
            roomId
        );


    }

    else{


        activeRooms.set(

            roomId,

            users

        );


    }


};





export default roomSocket;