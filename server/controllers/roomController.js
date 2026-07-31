// server/controllers/roomController.js

import asyncHandler from "../utils/asyncHandler.js";


import {

    createRoomService,

    getRoomsService,

    getRoomByIdService,

    deleteRoomService,

    joinRoomService,

    leaveRoomService,

    updateRoomService,

    getActiveRoomsService,

    deactivateRoomService

} from "../services/roomService.js";







/*
=================================================
CREATE ROOM
POST /api/rooms
=================================================
*/

export const createRoom = asyncHandler(
async(req,res)=>{


    const {

        roomId,

        roomName

    } = req.body;



    const createdBy =
    req.user
    ?
    req.user.id
    :
    req.body.createdBy || "Anonymous";





    const room =
    await createRoomService({

        roomId,

        roomName,

        createdBy

    });





    res.status(201).json({

        success:true,

        message:
        "Room created successfully",

        data:room

    });


});









/*
=================================================
GET ALL ROOMS
GET /api/rooms
=================================================
*/

export const getRooms = asyncHandler(
async(req,res)=>{


    const rooms =
    await getRoomsService();




    res.status(200).json({

        success:true,

        count:rooms.length,

        data:rooms

    });


});









/*
=================================================
GET ROOM BY ID
GET /api/rooms/:roomId
=================================================
*/

export const getRoomById = asyncHandler(
async(req,res)=>{


    const room =
    await getRoomByIdService(

        req.params.roomId

    );




    if(!room){


        return res.status(404).json({

            success:false,

            message:"Room not found"

        });


    }




    res.status(200).json({

        success:true,

        data:room

    });


});









/*
=================================================
DELETE ROOM
DELETE /api/rooms/:roomId
=================================================
*/

export const deleteRoom = asyncHandler(
async(req,res)=>{


    const room =
    await deleteRoomService(

        req.params.roomId

    );



    if(!room){

        return res.status(404).json({

            success:false,

            message:"Room not found"

        });

    }





    res.status(200).json({

        success:true,

        message:
        "Room deleted successfully"

    });


});









/*
=================================================
JOIN ROOM
POST /api/rooms/:roomId/join
=================================================
*/

export const joinRoom = asyncHandler(
async(req,res)=>{


    const {

        username

    } = req.body;




    const room =
    await joinRoomService(

        req.params.roomId,

        username

    );




    if(!room){

        return res.status(404).json({

            success:false,

            message:"Room not found"

        });

    }




    res.status(200).json({

        success:true,

        message:
        `${username} joined room`,

        participants:
        room.participants

    });


});









/*
=================================================
LEAVE ROOM
POST /api/rooms/:roomId/leave
=================================================
*/

export const leaveRoom = asyncHandler(
async(req,res)=>{


    const {

        username

    } = req.body;



    const room =
    await leaveRoomService(

        req.params.roomId,

        username

    );




    if(!room){

        return res.status(404).json({

            success:false,

            message:"Room not found"

        });

    }





    res.status(200).json({

        success:true,

        message:
        `${username} left room`,

        participants:
        room.participants

    });


});









/*
=================================================
UPDATE ROOM
PUT /api/rooms/:roomId
=================================================
*/

export const updateRoom = asyncHandler(
async(req,res)=>{


    const {

        roomName

    } = req.body;




    const room =
    await updateRoomService(

        req.params.roomId,

        {
            roomName
        }

    );





    if(!room){

        return res.status(404).json({

            success:false,

            message:"Room not found"

        });

    }





    res.status(200).json({

        success:true,

        message:
        "Room updated successfully",

        data:room

    });


});









/*
=================================================
GET ACTIVE ROOMS
GET /api/rooms/active
=================================================
*/

export const getActiveRooms = asyncHandler(
async(req,res)=>{


    const rooms =
    await getActiveRoomsService();




    res.status(200).json({

        success:true,

        count:rooms.length,

        data:rooms

    });


});









/*
=================================================
DEACTIVATE ROOM
PATCH /api/rooms/:roomId/deactivate
=================================================
*/

export const deactivateRoom = asyncHandler(
async(req,res)=>{


    const room =
    await deactivateRoomService(

        req.params.roomId

    );




    if(!room){

        return res.status(404).json({

            success:false,

            message:"Room not found"

        });

    }





    res.status(200).json({

        success:true,

        message:
        "Room deactivated successfully",

        data:room

    });


});









/*
=================================================
GENERATE INVITE LINK
GET /api/rooms/:roomId/invite
=================================================
*/

export const generateInvite = asyncHandler(
async(req,res)=>{


    const roomId =
    req.params.roomId.toUpperCase();




    const inviteLink =
    `${process.env.CLIENT_URL}/workspace/${roomId}`;





    res.status(200).json({

        success:true,

        inviteLink

    });


});