import mongoose from "mongoose";



const memberSchema = new mongoose.Schema(
  {

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    role: {
      type: String,

      enum: [
        "owner",
        "editor",
        "viewer",
      ],

      default: "viewer",
    },


    joinedAt: {
      type: Date,
      default: Date.now,
    },


    isActive: {
      type: Boolean,
      default: false,
    },


  },
  {
    _id: false,
  }
);





const roomSchema = new mongoose.Schema(

  {


    // ==================================
    // ROOM INFORMATION
    // ==================================

    roomName: {

      type: String,

      required: [
        true,
        "Room name is required"
      ],

      trim: true,

      minlength: 3,

      maxlength: 100,

    },



    description: {

      type: String,

      default: "",

      maxlength: 500,

    },



    roomId: {

      type: String,

      required: true,

      unique: true,

    },



    // ==================================
    // OWNER
    // ==================================

    owner: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },



    // ==================================
    // MEMBERS
    // ==================================

    members: [

      memberSchema

    ],




    // ==================================
    // ROOM ACCESS
    // ==================================

    visibility: {

      type: String,

      enum: [

        "private",

        "public"

      ],

      default: "private",

    },



    inviteCode: {

      type: String,

      unique: true,

    },



    maxMembers: {

      type: Number,

      default: 10,

    },



    // ==================================
    // COLLABORATION FEATURES
    // ==================================


    features: {


      codeEditor: {

        type: Boolean,

        default: true,

      },


      whiteboard: {

        type: Boolean,

        default: true,

      },


      chat: {

        type: Boolean,

        default: true,

      },


      terminal: {

        type: Boolean,

        default: true,

      },


      fileExplorer: {

        type: Boolean,

        default: true,

      },


    },





    // ==================================
    // EDITOR SETTINGS
    // ==================================

    editorSettings: {


      language: {

        type: String,

        default: "javascript",

      },


      theme: {

        type: String,

        default: "vs-dark",

      },


      fontSize: {

        type: Number,

        default: 14,

      },


      wordWrap: {

        type: Boolean,

        default: true,

      },


    },





    // ==================================
    // ACTIVE USERS
    // ==================================


    activeUsers: [

      {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

      }

    ],





    // ==================================
    // ROOM STATUS
    // ==================================

    isActive: {

      type: Boolean,

      default: true,

    },



    isLocked: {

      type: Boolean,

      default: false,

    },



  },

  {

    timestamps:true,

  }

);





// ==================================
// METHODS
// ==================================



// Add member

roomSchema.methods.addMember =
async function(userId, role="viewer"){


  const exists =
    this.members.some(
      member =>
        member.user.toString()
        === userId.toString()
    );


  if(!exists){

    this.members.push({

      user:userId,

      role,

    });

  }


  return await this.save();

};






// Remove member

roomSchema.methods.removeMember =
async function(userId){


  this.members =
    this.members.filter(

      member =>
      member.user.toString()
      !== userId.toString()

    );


  return await this.save();

};







// Check member

roomSchema.methods.isMember =
function(userId){


  return this.members.some(

    member =>
    member.user.toString()
    === userId.toString()

  );

};







// Get user permission

roomSchema.methods.getRole =
function(userId){


  const member =
    this.members.find(

      member =>
      member.user.toString()
      === userId.toString()

    );


  return member
    ? member.role
    : null;


};






// ==================================
// INDEXES
// ==================================


roomSchema.index({

  owner:1

});


roomSchema.index({

  "members.user":1

});




// ==================================
// EXPORT
// ==================================


const Room =
mongoose.model(
  "Room",
  roomSchema
);



export default Room;