// server/utils/constants.js

import path from "path";
import { fileURLToPath } from "url";



/*
====================================================
SYNCSPACE GLOBAL CONSTANTS
====================================================
*/



/*
====================================================
PATH CONFIGURATION
====================================================
*/


const __filename =
    fileURLToPath(import.meta.url);


const __dirname =
    path.dirname(__filename);



export const SERVER_DIR =
    path.join(
        __dirname,
        ".."
    );



export const WORKSPACE_DIR =
    path.join(
        SERVER_DIR,
        "workspace"
    );



export const UPLOAD_DIR =
    path.join(
        SERVER_DIR,
        "uploads"
    );



export const LOG_DIR =
    path.join(
        SERVER_DIR,
        "logs"
    );



export const TEMP_DIR =
    path.join(
        SERVER_DIR,
        "temp"
    );



/*
====================================================
CODE RUNNER PATH
====================================================
*/


export const TEMP_RUN_PATH =
    TEMP_DIR;






/*
====================================================
SERVER CONFIGURATION
====================================================
*/


export const PORT =
    process.env.PORT || 5000;



export const NODE_ENV =
    process.env.NODE_ENV || "development";



export const JWT_SECRET =
    process.env.JWT_SECRET ||
    "syncspace_secret_key";



export const JWT_EXPIRE =
    process.env.JWT_EXPIRE ||
    "7d";







/*
====================================================
USER ROLES
====================================================
*/


export const USER_ROLES = {

    USER:"user",

    ADMIN:"admin"

};







/*
====================================================
ROOM CONSTANTS
====================================================
*/


export const ROOM_STATUS = {

    ACTIVE:true,

    INACTIVE:false

};



export const MAX_ROOM_PARTICIPANTS = 50;



export const DEFAULT_ROOM_NAME =
    "Untitled Workspace";







/*
====================================================
SUPPORTED LANGUAGES
====================================================
*/


export const SUPPORTED_LANGUAGES = [

    "javascript",

    "typescript",

    "python",

    "java",

    "c",

    "cpp",

    "html",

    "css",

    "json"

];







/*
====================================================
EDITOR SETTINGS
====================================================
*/


export const EDITOR_DEFAULTS = {

    THEME:"vs-dark",

    FONT_SIZE:16,

    TAB_SIZE:2,

    WORD_WRAP:true,

    MINIMAP:true,

    AUTO_SAVE:true

};







/*
====================================================
FILE SYSTEM CONSTANTS
====================================================
*/


export const FILE_LIMITS = {

    MAX_FILE_SIZE:
    50 * 1024 * 1024,


    MAX_UPLOAD_FILES:10

};





export const ALLOWED_FILE_TYPES = [

    "text/plain",

    "text/javascript",

    "application/javascript",

    "application/json",

    "text/css",

    "text/html",

    "application/pdf",

    "image/png",

    "image/jpeg"

];







/*
====================================================
CODE RUNNER CONFIGURATION
====================================================
*/


export const RUNNER_CONFIG = {


    TIMEOUT:

    10000,


    MAX_OUTPUT_LENGTH:

    10000,


    TEMP_EXTENSION:

    ".tmp",


    SUPPORTED_RUN_LANGUAGES:[


        "javascript",

        "python",

        "java",

        "c",

        "cpp"


    ]

};







/*
====================================================
TERMINAL CONSTANTS
====================================================
*/


export const TERMINAL_CONFIG = {

    MAX_HISTORY:100,


    COMMAND_TIMEOUT:10000,


    MAX_SESSIONS:5

};







/*
====================================================
CHAT CONSTANTS
====================================================
*/


export const CHAT_CONFIG = {

    MAX_MESSAGE_LENGTH:2000,


    MESSAGE_LIMIT:100

};







/*
====================================================
JWT CONFIGURATION
====================================================
*/


export const JWT_CONFIG = {

    DEFAULT_EXPIRE:"7d"

};







/*
====================================================
PAGINATION
====================================================
*/


export const PAGINATION = {

    PAGE:1,

    LIMIT:20

};







/*
====================================================
SOCKET EVENTS
====================================================
*/


export const SOCKET_EVENTS = {


    JOIN_ROOM:
    "join-room",


    LEAVE_ROOM:
    "leave-room",


    SEND_MESSAGE:
    "send-message",


    RECEIVE_MESSAGE:
    "receive-message",


    CODE_UPDATE:
    "code-update",


    FILE_UPDATE:
    "file-update",


    USER_CONNECTED:
    "user-connected",


    USER_DISCONNECTED:
    "user-disconnected"

};







/*
====================================================
DEFAULT CODE
====================================================
*/


export const DEFAULT_CODE = `
// Welcome to SyncSpace
// Real-time collaborative editor

console.log("Hello SyncSpace");
`;







/*
====================================================
API MESSAGES
====================================================
*/


export const MESSAGES = {


    SUCCESS:
    "Operation completed successfully",


    SERVER_ERROR:
    "Internal Server Error",


    NOT_FOUND:
    "Resource not found",


    UNAUTHORIZED:
    "Unauthorized access"

};







/*
====================================================
DEFAULT EXPORT
====================================================
*/


export default {


    SERVER_DIR,

    WORKSPACE_DIR,

    UPLOAD_DIR,

    LOG_DIR,

    TEMP_DIR,

    TEMP_RUN_PATH,


    PORT,

    NODE_ENV,


    JWT_SECRET,

    JWT_EXPIRE,


    USER_ROLES,


    ROOM_STATUS,


    MAX_ROOM_PARTICIPANTS,


    SUPPORTED_LANGUAGES,


    EDITOR_DEFAULTS,


    FILE_LIMITS,


    ALLOWED_FILE_TYPES,


    RUNNER_CONFIG,


    TERMINAL_CONFIG,


    CHAT_CONFIG,


    JWT_CONFIG,


    PAGINATION,


    SOCKET_EVENTS,


    DEFAULT_CODE,


    MESSAGES

};