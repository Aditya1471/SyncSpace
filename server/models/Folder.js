import mongoose from "mongoose";


const folderSchema = new mongoose.Schema(
  {

    // ==================================
    // FOLDER INFORMATION
    // ==================================

    name: {

      type: String,

      required: [
        true,
        "Folder name is required"
      ],

      trim: true,

      maxlength: 100,

    },


    path: {

      type: String,

      required: true,

      trim: true,

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



    owner: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },



    // ==================================
    // NESTED FOLDER SYSTEM
    // ==================================

    parentFolder: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "Folder",

      default: null,

    },



    children: [

      {

        type: mongoose.Schema.Types.ObjectId,

        ref: "Folder",

      }

    ],




    // ==================================
    // FOLDER METADATA
    // ==================================

    isRoot: {

      type: Boolean,

      default: false,

    },


    isDeleted: {

      type: Boolean,

      default: false,

    },



    size: {

      type: Number,

      default: 0,

    },


  },

  {

    timestamps:true,

  }

);






// ==================================
// METHODS
// ==================================



// Add child folder

folderSchema.methods.addChild =
async function(folderId){


  if(
    !this.children.includes(folderId)
  ){

    this.children.push(folderId);

  }


  return await this.save();

};






// Remove child folder

folderSchema.methods.removeChild =
async function(folderId){


  this.children =
  this.children.filter(

    id =>
    id.toString()
    !== folderId.toString()

  );


  return await this.save();

};







// Get folder depth

folderSchema.methods.getDepth =
async function(){


  let depth = 0;

  let current = this;


  while(current.parentFolder){

    depth++;


    current =
    await mongoose
    .model("Folder")
    .findById(
      current.parentFolder
    );

  }


  return depth;

};







// ==================================
// INDEXES
// ==================================


folderSchema.index({

  parentFolder:1,

});


folderSchema.index({

  path:1,

});





// ==================================
// EXPORT
// ==================================


const Folder =
mongoose.model(
  "Folder",
  folderSchema
);



export default Folder;