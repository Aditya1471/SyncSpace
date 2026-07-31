import mongoose from "mongoose";


const versionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      default: "",
    },

    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

  },
  {
    _id: false,
  }
);



const fileSchema = new mongoose.Schema(
  {

    // ==================================
    // FILE INFORMATION
    // ==================================

    name: {

      type: String,

      required: [
        true,
        "File name is required"
      ],

      trim: true,

    },


    extension: {

      type: String,

      default: "",

    },


    language: {

      type: String,

      default: "plaintext",

    },


    mimeType: {

      type: String,

      default: "",

    },



    // ==================================
    // FILE CONTENT
    // ==================================

    content: {

      type: String,

      default: "",

    },



    size: {

      type: Number,

      default: 0,

    },



    encoding: {

      type: String,

      default: "UTF-8",

    },



    // ==================================
    // WORKSPACE CONNECTION
    // ==================================

    room: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "Room",

      required: true,

      index: true,

    },


    folder: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "Folder",

      default: null,

    },



    owner: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },



    // ==================================
    // EDITOR INFORMATION
    // ==================================

    lastEditedBy: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,

    },


    lastEditedAt: {

      type: Date,

      default: Date.now,

    },



    // ==================================
    // FILE CONTROL
    // ==================================

    isLocked: {

      type: Boolean,

      default: false,

    },


    lockedBy: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,

    },



    isDeleted: {

      type: Boolean,

      default: false,

    },



    // ==================================
    // COLLABORATION
    // ==================================

    activeEditors: [

      {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

      }

    ],



    cursorPositions: [

      {

        user: {

          type: mongoose.Schema.Types.ObjectId,

          ref: "User",

        },


        line: {

          type: Number,

          default: 0,

        },


        column: {

          type: Number,

          default: 0,

        },

      }

    ],




    // ==================================
    // VERSION HISTORY
    // ==================================

    versions: [

      versionSchema

    ],



    currentVersion: {

      type: Number,

      default: 1,

    },



  },

  {

    timestamps:true,

  }

);




// ==================================
// METHODS
// ==================================


// Update file content

fileSchema.methods.updateContent =
async function(
  content,
  userId
){


  this.content = content;


  this.lastEditedBy = userId;


  this.lastEditedAt = new Date();


  this.currentVersion += 1;



  this.versions.push({

    content,

    editedBy:userId,

    message:
      "File updated",

  });



  return await this.save();

};






// Lock file

fileSchema.methods.lock =
async function(userId){


  this.isLocked = true;


  this.lockedBy = userId;


  return await this.save();

};







// Unlock file

fileSchema.methods.unlock =
async function(){


  this.isLocked = false;


  this.lockedBy = null;


  return await this.save();

};







// Add active editor

fileSchema.methods.addEditor =
async function(userId){


  if(
    !this.activeEditors.includes(userId)
  ){

    this.activeEditors.push(userId);

  }


  return await this.save();

};







// Remove active editor

fileSchema.methods.removeEditor =
async function(userId){


  this.activeEditors =
  this.activeEditors.filter(

    id =>
    id.toString()
    !== userId.toString()

  );


  return await this.save();

};






// ==================================
// INDEXES
// ==================================


fileSchema.index({

  room:1,

});


fileSchema.index({

  folder:1,

});


fileSchema.index({

  name:1,

});



fileSchema.index({

  language:1,

});




// ==================================
// EXPORT
// ==================================


const File =
mongoose.model(
  "File",
  fileSchema
);



export default File;