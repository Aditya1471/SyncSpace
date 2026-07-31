import Editor from "../models/Editor.js";





/*
====================================================
SYNCSPACE EDITOR SOCKET
====================================================

Handles:

- Live code collaboration
- Editor state sync
- File changes
- Language changes

Used with:

- Monaco Editor
- Socket.IO

====================================================
*/





const editorSocket = (io)=>{


    io.on(

        "connection",

        (socket)=>{



            console.log(
                "Editor Socket Connected:",
                socket.id
            );







            /*
            ========================================
            JOIN EDITOR SESSION
            ========================================
            */


            socket.on(

                "join-editor",

                async(data)=>{


                    try{


                        const {


                            roomId,

                            userId,

                            username,


                            fileName,


                            language


                        } = data;






                        socket.join(
                            roomId
                        );





                        socket.editorData = {

                            roomId,

                            userId,

                            username

                        };







                        /*
                        Load existing editor data
                        */


                        let editor =
                        await Editor.findOne({

                            roomId,

                            fileName

                        });






                        if(!editor){


                            editor =
                            await Editor.create({

                                roomId,

                                fileName,

                                language,

                                code:""


                            });


                        }






                        socket.emit(

                            "editor-load",

                            {

                                fileName:
                                editor.fileName,


                                language:
                                editor.language,


                                code:
                                editor.code

                            }

                        );






                        socket.to(roomId)
                        .emit(

                            "user-joined-editor",

                            {

                                userId,

                                username

                            }

                        );



                    }

                    catch(error){


                        console.error(

                            "Join Editor Error:",
                            error.message

                        );


                    }



                }

            );









            /*
            ========================================
            CODE CHANGE
            ========================================
            */


            socket.on(

                "code-change",

                async(data)=>{


                    try{


                        const {


                            roomId,

                            fileName,

                            code,

                            language


                        } = data;






                        socket.to(roomId)
                        .emit(

                            "code-update",

                            {

                                code,

                                fileName,

                                language,

                                updatedBy:
                                socket.editorData?.username

                            }

                        );







                        await Editor.findOneAndUpdate(

                            {

                                roomId,

                                fileName

                            },


                            {

                                code,

                                language,

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

                            "Code Update Error:",
                            error.message

                        );


                    }



                }

            );









            /*
            ========================================
            FILE CHANGE
            ========================================
            */


            socket.on(

                "file-change",

                (data)=>{


                    socket.to(
                        data.roomId
                    )
                    .emit(

                        "file-update",

                        {

                            fileName:
                            data.fileName,


                            language:
                            data.language


                        }

                    );


                }

            );









            /*
            ========================================
            LANGUAGE CHANGE
            ========================================
            */


            socket.on(

                "language-change",

                (data)=>{


                    socket.to(

                        data.roomId

                    )
                    .emit(

                        "language-update",

                        {

                            language:
                            data.language

                        }

                    );


                }

            );









            /*
            ========================================
            SAVE FILE
            ========================================
            */


            socket.on(

                "save-code",

                async(data)=>{


                    try{


                        await Editor.findOneAndUpdate(

                            {

                                roomId:
                                data.roomId,


                                fileName:
                                data.fileName


                            },


                            {

                                code:
                                data.code,


                                savedAt:
                                new Date()

                            }

                        );






                        socket.emit(

                            "save-success",

                            {

                                message:
                                "File saved successfully"

                            }

                        );


                    }

                    catch(error){


                        socket.emit(

                            "save-error",

                            {

                                message:
                                "Save failed"

                            }

                        );


                    }


                }

            );









            /*
            ========================================
            USER TYPING
            ========================================
            */


            socket.on(

                "editor-typing",

                (data)=>{


                    socket.to(

                        data.roomId

                    )
                    .emit(

                        "editor-user-typing",

                        {

                            username:
                            socket.editorData?.username

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
                        socket.editorData
                    ){


                        socket.to(

                            socket.editorData.roomId

                        )
                        .emit(

                            "user-left-editor",

                            {

                                username:
                                socket.editorData.username

                            }

                        );


                    }




                    console.log(

                        "Editor Socket Disconnected:",
                        socket.id

                    );


                }

            );




        }

    );


};





export default editorSocket;