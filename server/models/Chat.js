import mongoose from "mongoose";


// ==========================================
// REACTION SCHEMA
// ==========================================

const reactionSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    emoji: {
      type: String,
      required: true,
    },


  },
  {
    _id: false,
  }
);



// ==========================================
// ATTACHMENT SCHEMA
// ==========================================

const attachmentSchema = new mongoose.Schema(
  {

    url: {
      type: String,
      required: true,
    },


    type: {

      type: String,

      enum: [
        "image",
        "file",
        "code",
      ],

      default: "file",

    },


    name: {

      type: String,

      default: "",

    },


    size: {

      type: Number,

      default: 0,

    },


  },
  {
    _id: false,
  }
);



// ==========================================
// CHAT MESSAGE SCHEMA
// ==========================================


const chatSchema = new mongoose.Schema(

  {


    // ======================================
    // ROOM CONNECTION
    // ======================================

    room: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "Room",

      required: true,

      index: true,

    },



    // ======================================
    // MESSAGE OWNER
    // ======================================

    sender: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },



    // ======================================
    // MESSAGE CONTENT
    // ======================================

    message: {

      type: String,

      required: true,

      trim: true,

      maxlength: 5000,

    },



    // ======================================
    // REPLY SYSTEM
    // ======================================

    replyTo: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "Chat",

      default: null,

    },



    // ======================================
    // ATTACHMENTS
    // ======================================

    attachments: [

      attachmentSchema

    ],



    // ======================================
    // MESSAGE STATUS
    // ======================================

    isEdited: {

      type: Boolean,

      default: false,

    },


    editedAt: {

      type: Date,

      default: null,

    },



    isDeleted: {

      type: Boolean,

      default: false,

    },



    deletedAt: {

      type: Date,

      default: null,

    },



    // ======================================
    // REACTIONS
    // ======================================

    reactions: [

      reactionSchema

    ],



    // ======================================
    // READ RECEIPTS
    // ======================================

    readBy: [

      {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

      }

    ],




    // ======================================
    // MESSAGE FEATURES
    // ======================================


    isPinned: {

      type: Boolean,

      default: false,

    },


    pinnedBy: {

      type: mongoose.Schema.Types.ObjectId,

      ref:"User",

      default:null,

    },


    pinnedAt: {

      type: Date,

      default:null,

    },



  },

  {

    timestamps:true,

  }

);




// ==========================================
// METHODS
// ==========================================



// Edit Message

chatSchema.methods.editMessage =
async function(newMessage){


  this.message = newMessage;


  this.isEdited = true;


  this.editedAt = new Date();



  return await this.save();

};






// Delete Message

chatSchema.methods.deleteMessage =
async function(){


  this.isDeleted = true;


  this.deletedAt = new Date();


  this.message =
  "This message was deleted";



  return await this.save();

};






// Add Reaction

chatSchema.methods.addReaction =
async function(userId, emoji){


  const exists =
  this.reactions.find(

    reaction =>

    reaction.user.toString()
    === userId.toString()

  );



  if(exists){

    exists.emoji = emoji;

  }

  else{

    this.reactions.push({

      user:userId,

      emoji,

    });

  }



  return await this.save();

};






// Remove Reaction

chatSchema.methods.removeReaction =
async function(userId){


  this.reactions =
  this.reactions.filter(

    reaction =>

    reaction.user.toString()
    !== userId.toString()

  );


  return await this.save();

};







// Mark Read

chatSchema.methods.markRead =
async function(userId){


  const alreadyRead =
  this.readBy.includes(userId);



  if(!alreadyRead){

    this.readBy.push(userId);

  }



  return await this.save();

};






// Pin Message

chatSchema.methods.pin =
async function(userId){


  this.isPinned = true;


  this.pinnedBy = userId;


  this.pinnedAt = new Date();



  return await this.save();

};






// Unpin Message

chatSchema.methods.unpin =
async function(){


  this.isPinned = false;


  this.pinnedBy = null;


  this.pinnedAt = null;



  return await this.save();

};






// ==========================================
// INDEXES
// ==========================================


chatSchema.index({

  room:1,

  createdAt:-1

});



chatSchema.index({

  sender:1

});



chatSchema.index({

  replyTo:1

});




// ==========================================
// EXPORT
// ==========================================


const Chat =
mongoose.model(
  "Chat",
  chatSchema
);


export default Chat;