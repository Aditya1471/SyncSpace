import mongoose from "mongoose";





/*
====================================================
SYNCSPACE EDITOR MODEL
====================================================

Stores:

- Room code files
- Editor content
- Programming language
- File metadata

====================================================
*/





const editorSchema = new mongoose.Schema(

    {


        /*
        ============================================
        ROOM INFORMATION
        ============================================
        */


        roomId:{

            type:String,

            required:true,

            index:true,

            trim:true

        },





        /*
        ============================================
        FILE INFORMATION
        ============================================
        */


        fileName:{


            type:String,


            required:true,


            trim:true


        },




        filePath:{


            type:String,


            default:""


        },







        /*
        ============================================
        CODE CONTENT
        ============================================
        */


        code:{


            type:String,


            default:""


        },








        /*
        ============================================
        LANGUAGE
        ============================================
        */


        language:{


            type:String,


            default:"javascript"


        },








        /*
        ============================================
        OWNER
        ============================================
        */


        createdBy:{


            type:String,


            default:"Anonymous"


        },









        /*
        ============================================
        VERSION
        ============================================
        */


        version:{


            type:Number,


            default:1


        },








        /*
        ============================================
        LAST SAVED USER
        ============================================
        */


        lastEditedBy:{


            type:String,


            default:null


        },







        /*
        ============================================
        ACTIVE FILE
        ============================================
        */


        isActive:{


            type:Boolean,


            default:true


        }



    },


    {


        timestamps:true


    }


);







/*
====================================================
COMPOUND INDEX

One file name per room

Example:

ROOM123 + App.jsx

====================================================
*/


editorSchema.index(

    {

        roomId:1,

        fileName:1

    },


    {

        unique:true

    }

);








const Editor =
mongoose.model(

    "Editor",

    editorSchema

);





export default Editor;