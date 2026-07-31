import Chat from "../models/Chat.js";



/*
===================================================
SEND MESSAGE
===================================================
*/

export const sendMessage =
async(data)=>{


    const {
        roomId,
        sender,
        message,
        type="text",
        file=null
    } = data;



    if(
        !roomId ||
        !sender ||
        !message
    ){

        throw new Error(
            "Message details required"
        );

    }





    const chat =
    await Chat.create({

        room:roomId,

        sender,

        message,

        type,

        file

    });





    return await chat.populate(
        "sender",
        "username fullName avatar"
    );


};









/*
===================================================
GET ROOM MESSAGES
===================================================
*/

export const getMessages =
async(
    roomId,
    limit=50
)=>{


    const messages =
    await Chat.find({

        room:roomId

    })

    .populate(
        "sender",
        "username fullName avatar"
    )

    .sort({

        createdAt:1

    })

    .limit(limit);




    return messages;


};









/*
===================================================
GET LATEST MESSAGES
===================================================
*/

export const getLatestMessages =
async(
    roomId,
    count=20
)=>{


    return await Chat.find({

        room:roomId

    })

    .populate(
        "sender",
        "username avatar"
    )

    .sort({

        createdAt:-1

    })

    .limit(count);


};









/*
===================================================
EDIT MESSAGE
===================================================
*/

export const editMessage =
async(
    messageId,
    userId,
    newMessage
)=>{


    const chat =
    await Chat.findById(
        messageId
    );



    if(!chat){

        throw new Error(
            "Message not found"
        );

    }





    if(
        chat.sender.toString()
        !== userId.toString()
    ){

        throw new Error(
            "Not allowed"
        );

    }





    chat.message =
    newMessage;



    chat.isEdited =
    true;



    await chat.save();



    return chat;


};









/*
===================================================
DELETE MESSAGE
===================================================
*/

export const deleteMessage =
async(
    messageId,
    userId
)=>{


    const chat =
    await Chat.findById(
        messageId
    );



    if(!chat){

        throw new Error(
            "Message not found"
        );

    }





    if(
        chat.sender.toString()
        !== userId.toString()
    ){

        throw new Error(
            "Not allowed"
        );

    }





    await chat.deleteOne();



    return true;


};









/*
===================================================
ADD REACTION
===================================================
*/

export const addReaction =
async(
    messageId,
    userId,
    emoji
)=>{


    const chat =
    await Chat.findById(
        messageId
    );



    if(!chat){

        throw new Error(
            "Message not found"
        );

    }





    const existing =
    chat.reactions.find(

        reaction =>

        reaction.user.toString()
        === userId.toString()

    );





    if(existing){


        existing.emoji =
        emoji;


    }

    else{


        chat.reactions.push({

            user:userId,

            emoji

        });


    }





    await chat.save();



    return chat;


};









/*
===================================================
REMOVE REACTION
===================================================
*/

export const removeReaction =
async(
    messageId,
    userId
)=>{


    const chat =
    await Chat.findById(
        messageId
    );



    if(!chat){

        throw new Error(
            "Message not found"
        );

    }





    chat.reactions =
    chat.reactions.filter(

        reaction =>

        reaction.user.toString()
        !== userId.toString()

    );





    await chat.save();



    return chat;


};









/*
===================================================
CLEAR ROOM CHAT
===================================================
*/

export const clearChat =
async(
    roomId
)=>{


    await Chat.deleteMany({

        room:roomId

    });



    return true;


};









/*
===================================================
SEARCH MESSAGES
===================================================
*/

export const searchMessages =
async(
    roomId,
    keyword
)=>{


    const messages =
    await Chat.find({

        room:roomId,


        message:{
            $regex:keyword,
            $options:"i"
        }

    })

    .populate(
        "sender",
        "username avatar"
    );



    return messages;


};