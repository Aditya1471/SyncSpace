import Whiteboard from "../models/Whiteboard.js";





/*
====================================================
SYNCSPACE WHITEBOARD SOCKET
====================================================

Handles:

- Canvas drawing
- Shapes
- Erasing
- Clear canvas
- Whiteboard sync

Used with:

- React Konva
- Socket.IO

====================================================
*/





const whiteboardSocket = (io)=>{


    io.on(

        "connection",

        (socket)=>{


            console.log(

                "Whiteboard Socket Connected:",
                socket.id

            );









            /*
            ========================================
            JOIN WHITEBOARD ROOM
            ========================================
            */


            socket.on(

                "join-whiteboard",

                async(data)=>{


                    try{


                        const {

                            roomId,

                            username


                        } = data;






                        socket.join(
                            roomId
                        );






                        socket.whiteboardData = {

                            roomId,

                            username

                        };







                        let board =
                        await Whiteboard.findOne({

                            roomId

                        });








                        if(!board){


                            board =
                            await Whiteboard.create({

                                roomId,

                                elements:[]

                            });


                        }







                        socket.emit(

                            "whiteboard-load",

                            {

                                elements:
                                board.elements

                            }

                        );







                        socket.to(roomId)
                        .emit(

                            "whiteboard-user-joined",

                            {

                                username

                            }

                        );



                    }

                    catch(error){


                        console.error(

                            "Whiteboard Join Error:",
                            error.message

                        );


                    }


                }

            );









            /*
            ========================================
            DRAW ELEMENT
            ========================================
            */


            socket.on(

                "whiteboard-draw",

                async(data)=>{


                    try{


                        const {

                            roomId,

                            element


                        } = data;







                        socket.to(roomId)
                        .emit(

                            "whiteboard-update",

                            element

                        );








                        await Whiteboard.findOneAndUpdate(

                            {

                                roomId

                            },


                            {

                                $push:{

                                    elements:
                                    element

                                },


                                updatedAt:
                                new Date()

                            },


                            {

                                upsert:true

                            }

                        );



                    }

                    catch(error){


                        console.error(

                            "Draw Error:",
                            error.message

                        );


                    }



                }

            );









            /*
            ========================================
            UPDATE ELEMENT
            ========================================
            */


            socket.on(

                "whiteboard-update-element",

                (data)=>{


                    socket.to(

                        data.roomId

                    )
                    .emit(

                        "whiteboard-element-updated",

                        data.element

                    );


                }

            );









            /*
            ========================================
            CLEAR BOARD
            ========================================
            */


            socket.on(

                "whiteboard-clear",

                async(data)=>{


                    try{


                        await Whiteboard.findOneAndUpdate(

                            {

                                roomId:
                                data.roomId

                            },


                            {

                                elements:[]

                            }

                        );






                        io.to(

                            data.roomId

                        )
                        .emit(

                            "whiteboard-cleared"

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
            UNDO / REDO
            ========================================
            */


            socket.on(

                "whiteboard-history",

                (data)=>{


                    socket.to(

                        data.roomId

                    )
                    .emit(

                        "whiteboard-history-update",

                        {

                            action:
                            data.action,


                            element:
                            data.element

                        }

                    );


                }

            );









            /*
            ========================================
            CURSOR MOVE
            ========================================
            */


            socket.on(

                "whiteboard-cursor",

                (data)=>{


                    socket.to(

                        data.roomId

                    )
                    .emit(

                        "whiteboard-cursor-update",

                        {

                            username:
                            socket.whiteboardData?.username,


                            x:
                            data.x,


                            y:
                            data.y


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
                        socket.whiteboardData
                    ){


                        socket.to(

                            socket.whiteboardData.roomId

                        )
                        .emit(

                            "whiteboard-user-left",

                            {

                                username:
                                socket.whiteboardData.username

                            }

                        );


                    }




                    console.log(

                        "Whiteboard Socket Disconnected:",
                        socket.id

                    );


                }

            );





        }

    );


};





export default whiteboardSocket;