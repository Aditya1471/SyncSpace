// server/services/roomService.js

import Room from "../models/Room.js";



/*
===================================================
GENERATE ROOM ID
===================================================
*/

const generateRoomId = () => {

    return Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

};








/*
===================================================
CREATE ROOM SERVICE
===================================================
*/

export const createRoomService = async (data) => {

    const {
        roomId,
        roomName,
        createdBy
    } = data;



    if (!roomName) {

        throw new Error(
            "Room name is required"
        );

    }



    let finalRoomId =
        roomId || generateRoomId();



    let existingRoom =
        await Room.findOne({

            roomId: finalRoomId

        });



    while (existingRoom) {

        finalRoomId =
            generateRoomId();


        existingRoom =
            await Room.findOne({

                roomId: finalRoomId

            });

    }





    const room =
        await Room.create({

            roomId: finalRoomId,

            roomName,

            createdBy:
            createdBy || "Anonymous",

            participants: [],

            isActive: true,

            code:
            "// Start coding in SyncSpace\n",

            chatHistory: []

        });





    return room;

};









/*
===================================================
GET ALL ROOMS SERVICE
===================================================
*/

export const getRoomsService = async () => {


    const rooms =
        await Room.find()

        .sort({

            createdAt: -1

        });



    return rooms;

};









/*
===================================================
GET SINGLE ROOM SERVICE
===================================================
*/

export const getRoomByIdService = async (roomId) => {


    const room =
        await Room.findOne({

            roomId

        });



    return room;

};









/*
===================================================
UPDATE ROOM SERVICE
===================================================
*/

export const updateRoomService = async (
    roomId,
    data
) => {


    const room =
        await Room.findOne({

            roomId

        });



    if (!room) {

        return null;

    }





    if (data.roomName) {

        room.roomName =
            data.roomName;

    }



    if (data.description) {

        room.description =
            data.description;

    }



    room.updatedAt =
        new Date();




    await room.save();



    return room;

};









/*
===================================================
DELETE ROOM SERVICE
===================================================
*/

export const deleteRoomService = async (roomId) => {


    const room =
        await Room.findOne({

            roomId

        });



    if (!room) {

        return null;

    }





    await Room.deleteOne({

        roomId

    });



    return true;

};









/*
===================================================
JOIN ROOM SERVICE
===================================================
*/

export const joinRoomService = async (
    roomId,
    username
) => {


    const room =
        await Room.findOne({

            roomId

        });



    if (!room) {

        return null;

    }





    const alreadyJoined =
        room.participants.includes(
            username
        );





    if (!alreadyJoined) {


        room.participants.push(
            username
        );


    }




    room.updatedAt =
        new Date();




    await room.save();



    return room;

};









/*
===================================================
LEAVE ROOM SERVICE
===================================================
*/

export const leaveRoomService = async (
    roomId,
    username
) => {


    const room =
        await Room.findOne({

            roomId

        });



    if (!room) {

        return null;

    }





    room.participants =
        room.participants.filter(

            user =>
                user !== username

        );





    room.updatedAt =
        new Date();




    await room.save();



    return room;

};









/*
===================================================
GET ACTIVE ROOMS SERVICE
===================================================
*/

export const getActiveRoomsService = async () => {


    const rooms =
        await Room.find({

            isActive: true

        })

        .sort({

            createdAt: -1

        });



    return rooms;

};









/*
===================================================
DEACTIVATE ROOM SERVICE
===================================================
*/

export const deactivateRoomService = async (
    roomId
) => {


    const room =
        await Room.findOne({

            roomId

        });



    if (!room) {

        return null;

    }





    room.isActive =
        false;



    await room.save();



    return room;

};









/*
===================================================
GET ROOM MEMBERS SERVICE
===================================================
*/

export const getRoomMembersService = async (
    roomId
) => {


    const room =
        await Room.findOne({

            roomId

        });



    if (!room) {

        return [];

    }



    return room.participants;

};