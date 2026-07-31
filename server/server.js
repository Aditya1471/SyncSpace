import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";


// ===============================
// Routes
// ===============================

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


// ===============================
// Socket
// ===============================

import socketHandler from "./socket/socketHandler.js";


// ===============================
// Middleware
// ===============================

import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";



dotenv.config();




// ===============================
// Database
// ===============================

connectDB();




// ===============================
// Express App
// ===============================

const app = express();





// ===============================
// HTTP SERVER
// ===============================

const server =
http.createServer(app);





// ===============================
// Socket.IO Setup
// ===============================

const io =
new Server(server,{

    cors:{

        origin:
        process.env.CLIENT_URL ||
        process.env.CLIENT_ORIGIN ||
        "http://localhost:5173",

        methods:[
            "GET",
            "POST"
        ],

        credentials:true

    }

});






// ===============================
// Security
// ===============================

app.use(

    helmet({

        crossOriginResourcePolicy:false

    })

);





// ===============================
// Logger
// ===============================

app.use(
    morgan("dev")
);






// ===============================
// CORS
// ===============================

app.use(

    cors({

        origin:
        process.env.CLIENT_URL ||
        process.env.CLIENT_ORIGIN ||
        "http://localhost:5173",


        credentials:true

    })

);






// ===============================
// Body Parser
// ===============================

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







// ===============================
// Static Upload Folder
// ===============================


const __filename =
fileURLToPath(import.meta.url);


const __dirname =
path.dirname(__filename);



app.use(

    "/uploads",

    express.static(

        path.join(
            __dirname,
            "uploads"
        )

    )

);









// ===============================
// Share Socket With Controllers
// ===============================


app.use(

    (req,res,next)=>{


        req.io = io;


        next();


    }

);









// ===============================
// Home Route
// ===============================


app.get(

    "/",

    (req,res)=>{


        res.json({

            success:true,

            message:
            "🚀 SyncSpace Backend Running"

        });


    }

);









// ===============================
// Health Check
// ===============================


app.get(

    "/api/health",

    (req,res)=>{


        res.status(200)
        .json({

            success:true,

            status:
            "Healthy",

            message:
            "SyncSpace Server Running"

        });


    }

);









// ===============================
// API ROUTES
// ===============================



app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/users",
    userRoutes
);


app.use(
    "/api/rooms",
    roomRoutes
);


app.use(
    "/api/chat",
    chatRoutes
);


app.use(
    "/api/editor",
    editorRoutes
);


app.use(
    "/api/files",
    fileRoutes
);


app.use(
    "/api/folders",
    folderRoutes
);


app.use(
    "/api/run",
    runRoutes
);


app.use(
    "/api/terminal",
    terminalRoutes
);


app.use(
    "/api/settings",
    settingsRoutes
);


app.use(
    "/api/upload",
    uploadRoutes
);









// ===============================
// Socket Handler
// ===============================


socketHandler(io);









// ===============================
// 404 Handler
// ===============================


app.use(
    notFound
);




// ===============================
// Error Handler
// ===============================


app.use(
    errorHandler
);









// ===============================
// START SERVER
// ===============================


const PORT =
process.env.PORT || 5000;



server.listen(

    PORT,

    ()=>{


        console.log(`
==========================================
🚀 SyncSpace Backend Started
==========================================
🌐 Port       : ${PORT}
🛢 Database   : MongoDB
⚡ Socket.IO  : Enabled
🔐 Auth       : Enabled
🏠 Rooms      : Enabled
💬 Chat       : Enabled
📝 Editor     : Enabled
🎨 Whiteboard : Enabled
⌨ Terminal   : Enabled
==========================================
        `);


    }

);