import { exec } from "child_process";
import { promisify } from "util";

import {
    getWorkspacePath
} from "./workspaceService.js";


const execAsync =
promisify(exec);





/*
===================================================
EXECUTE GIT COMMAND
===================================================
*/

const runGitCommand =
async(
    roomId,
    command
)=>{


    const workspace =
    getWorkspacePath(
        roomId
    );



    const {stdout,stderr}
    =
    await execAsync(

        command,

        {
            cwd:workspace
        }

    );



    if(stderr){

        throw new Error(
            stderr
        );

    }



    return stdout.trim();


};









/*
===================================================
INITIALIZE GIT
===================================================
*/

export const initRepository =
async(roomId)=>{


    return await runGitCommand(

        roomId,

        "git init"

    );


};









/*
===================================================
GET GIT STATUS
===================================================
*/

export const getStatus =
async(roomId)=>{


    return await runGitCommand(

        roomId,

        "git status --short"

    );


};









/*
===================================================
ADD FILE
===================================================
*/

export const addFile =
async(
    roomId,
    filePath="."
)=>{


    return await runGitCommand(

        roomId,

        `git add ${filePath}`

    );


};









/*
===================================================
REMOVE FILE
===================================================
*/

export const removeFile =
async(
    roomId,
    filePath
)=>{


    return await runGitCommand(

        roomId,

        `git rm ${filePath}`

    );


};









/*
===================================================
COMMIT CHANGES
===================================================
*/

export const commit =
async(
    roomId,
    message
)=>{


    if(!message){

        throw new Error(
            "Commit message required"
        );

    }



    return await runGitCommand(

        roomId,

        `git commit -m "${message}"`

    );


};









/*
===================================================
GET COMMIT HISTORY
===================================================
*/

export const getHistory =
async(roomId)=>{


    return await runGitCommand(

        roomId,

        "git log --oneline --decorate"

    );


};









/*
===================================================
GET CURRENT BRANCH
===================================================
*/

export const getCurrentBranch =
async(roomId)=>{


    return await runGitCommand(

        roomId,

        "git branch --show-current"

    );


};









/*
===================================================
GET ALL BRANCHES
===================================================
*/

export const getBranches =
async(roomId)=>{


    return await runGitCommand(

        roomId,

        "git branch"

    );


};









/*
===================================================
CREATE BRANCH
===================================================
*/

export const createBranch =
async(
    roomId,
    branchName
)=>{


    return await runGitCommand(

        roomId,

        `git checkout -b ${branchName}`

    );


};









/*
===================================================
CHECKOUT BRANCH
===================================================
*/

export const checkoutBranch =
async(
    roomId,
    branchName
)=>{


    return await runGitCommand(

        roomId,

        `git checkout ${branchName}`

    );


};









/*
===================================================
DELETE BRANCH
===================================================
*/

export const deleteBranch =
async(
    roomId,
    branchName
)=>{


    return await runGitCommand(

        roomId,

        `git branch -d ${branchName}`

    );


};









/*
===================================================
GET DIFF
===================================================
*/

export const getDiff =
async(roomId)=>{


    return await runGitCommand(

        roomId,

        "git diff"

    );


};









/*
===================================================
CHECK GIT INSTALLED
===================================================
*/

export const checkGit =
async(roomId)=>{


    try{


        const result =
        await runGitCommand(

            roomId,

            "git --version"

        );


        return {

            installed:true,

            version:result

        };


    }

    catch(error){


        return {

            installed:false,

            message:
            error.message

        };


    }


};