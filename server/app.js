import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";


// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import editorRoutes from "./routes/editorRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import runRoutes from "./routes/runRoutes.js";
import terminalRoutes from "./routes/terminalRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";


// Middleware
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";





const app = express();







/*
====================================================
PATH CONFIGURATION
====================================================
*/


const __filename =
fileURLToPath(import.meta.url);


const __dirname =
path.dirname(__filename);









/*
====================================================
SECURITY MIDDLEWARE
====================================================
*/


app.use(

    helmet({

        crossOriginResourcePolicy:false

    })

);







/*
====================================================
CORS CONFIGURATION
====================================================
*/


app.use(

    cors({

        origin:
        process.env.CLIENT_URL ||
        "http://localhost:5173",


        credentials:true

    })

);








/*
====================================================
BODY PARSER
====================================================
*/


app.use(
    express.json({
        limit:"50mb"
    })
);



app.use(
    express.urlencoded({

        extended:true,

        limit:"50mb"

    })
);








/*
====================================================
LOGGER
====================================================
*/


if(
    process.env.NODE_ENV !== "production"
){

    app.use(
        morgan("dev")
    );

}








/*
====================================================
STATIC FILES
====================================================
*/


app.use(

    "/uploads",

    express.static(

        path.join(
            __dirname,
            "uploads"
        )

    )

);









/*
====================================================
HEALTH CHECK
====================================================
*/


app.get(

    "/api/health",

    (req,res)=>{


        res.status(200)
        .json({

            success:true,

            message:
            "SyncSpace API Running",

            timestamp:
            new Date()

        });


    }

);









/*
====================================================
API ROUTES
====================================================
*/


// Authentication
app.use(
    "/api/auth",
    authRoutes
);


// Users
app.use(
    "/api/users",
    userRoutes
);


// Rooms
app.use(
    "/api/rooms",
    roomRoutes
);


// Chat
app.use(
    "/api/chat",
    chatRoutes
);


// Editor
app.use(
    "/api/editor",
    editorRoutes
);


// Files
app.use(
    "/api/files",
    fileRoutes
);


// Folders
app.use(
    "/api/folders",
    folderRoutes
);


// Code Runner
app.use(
    "/api/run",
    runRoutes
);


// Terminal
app.use(
    "/api/terminal",
    terminalRoutes
);


// Settings
app.use(
    "/api/settings",
    settingsRoutes
);


// Upload
app.use(
    "/api/upload",
    uploadRoutes
);









/*
====================================================
ERROR HANDLING
====================================================
*/


app.use(
    notFound
);


app.use(
    errorHandler
);








export default app;