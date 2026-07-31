import asyncHandler from "../utils/asyncHandler.js";

import {
    sendMessage,
    getMessages,
    getLatestMessages,
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    clearChat,
    searchMessages
} from "../services/chatService.js";



/*
===================================================
SEND MESSAGE
POST /api/chat/:roomId
===================================================
*/

export const createMessage =
asyncHandler(
async(req,res)=>{


    const {
        message,
        type,
        file
    } = req.body;



    const chat =
    await sendMessage({

        roomId:
        req.params.roomId,

        sender:
        req.user._id,

        message,

        type,

        file

    });





    res.status(201).json({

        success:true,

        message:
        "Message sent",

        data:chat

    });


});









/*
===================================================
GET ROOM MESSAGES
GET /api/chat/:roomId
===================================================
*/

export const getRoomMessages =
asyncHandler(
async(req,res)=>{


    const {
        limit
    } = req.query;




    const messages =
    await getMessages(

        req.params.roomId,

        Number(limit) || 50

    );





    res.status(200).json({

        success:true,

        count:
        messages.length,

        data:messages

    });


});









/*
===================================================
GET LATEST MESSAGES
GET /api/chat/:roomId/latest
===================================================
*/

export const latestMessages =
asyncHandler(
async(req,res)=>{


    const messages =
    await getLatestMessages(

        req.params.roomId,

        20

    );





    res.status(200).json({

        success:true,

        data:messages

    });


});









/*
===================================================
EDIT MESSAGE
PUT /api/chat/message/:id
===================================================
*/

export const updateMessage =
asyncHandler(
async(req,res)=>{


    const {
        message
    } = req.body;




    const updated =
    await editMessage(

        req.params.id,

        req.user._id,

        message

    );





    res.status(200).json({

        success:true,

        message:
        "Message updated",

        data:updated

    });


});









/*
===================================================
DELETE MESSAGE
DELETE /api/chat/message/:id
===================================================
*/

export const removeMessage =
asyncHandler(
async(req,res)=>{


    await deleteMessage(

        req.params.id,

        req.user._id

    );





    res.status(200).json({

        success:true,

        message:
        "Message deleted"

    });


});









/*
===================================================
ADD REACTION
POST /api/chat/message/:id/reaction
===================================================
*/

export const reactMessage =
asyncHandler(
async(req,res)=>{


    const {
        emoji
    } = req.body;




    const message =
    await addReaction(

        req.params.id,

        req.user._id,

        emoji

    );





    res.status(200).json({

        success:true,

        data:message

    });


});









/*
===================================================
REMOVE REACTION
DELETE /api/chat/message/:id/reaction
===================================================
*/

export const removeMessageReaction =
asyncHandler(
async(req,res)=>{


    const message =
    await removeReaction(

        req.params.id,

        req.user._id

    );





    res.status(200).json({

        success:true,

        message:
        "Reaction removed",

        data:message

    });


});









/*
===================================================
SEARCH CHAT
GET /api/chat/:roomId/search
===================================================
*/

export const searchChat =
asyncHandler(
async(req,res)=>{


    const {
        keyword
    } = req.query;




    const messages =
    await searchMessages(

        req.params.roomId,

        keyword

    );





    res.status(200).json({

        success:true,

        count:
        messages.length,

        data:messages

    });


});









/*
===================================================
CLEAR ROOM CHAT
DELETE /api/chat/:roomId
===================================================
*/

export const clearRoomChat =
asyncHandler(
async(req,res)=>{


    await clearChat(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        message:
        "Chat cleared successfully"

    });


});