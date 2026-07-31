import asyncHandler from "../utils/asyncHandler.js";

import {

    initRepository,

    getStatus,

    addFile,

    removeFile,

    commit,

    getHistory,

    getCurrentBranch,

    getBranches,

    createBranch,

    checkoutBranch,

    deleteBranch,

    getDiff,

    checkGit

} from "../services/gitService.js";





/*
===================================================
INITIALIZE GIT REPOSITORY
POST /api/git/:roomId/init
===================================================
*/

export const initializeGit =
asyncHandler(
async(req,res)=>{


    const result =
    await initRepository(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        message:
        "Git repository initialized",

        data:result

    });


});









/*
===================================================
GET GIT STATUS
GET /api/git/:roomId/status
===================================================
*/

export const status =
asyncHandler(
async(req,res)=>{


    const result =
    await getStatus(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        data:result

    });


});









/*
===================================================
ADD FILE
POST /api/git/:roomId/add
===================================================
*/

export const add =
asyncHandler(
async(req,res)=>{


    const {

        filePath

    } = req.body;





    const result =
    await addFile(

        req.params.roomId,

        filePath || "."

    );





    res.status(200).json({

        success:true,

        message:
        "File staged",

        data:result

    });


});









/*
===================================================
REMOVE FILE
DELETE /api/git/:roomId/remove
===================================================
*/

export const remove =
asyncHandler(
async(req,res)=>{


    const {

        filePath

    } = req.body;





    const result =
    await removeFile(

        req.params.roomId,

        filePath

    );





    res.status(200).json({

        success:true,

        message:
        "File removed",

        data:result

    });


});









/*
===================================================
COMMIT CHANGES
POST /api/git/:roomId/commit
===================================================
*/

export const createCommit =
asyncHandler(
async(req,res)=>{


    const {

        message

    } = req.body;





    const result =
    await commit(

        req.params.roomId,

        message

    );





    res.status(200).json({

        success:true,

        message:
        "Commit created",

        data:result

    });


});









/*
===================================================
GET COMMIT HISTORY
GET /api/git/:roomId/history
===================================================
*/

export const history =
asyncHandler(
async(req,res)=>{


    const result =
    await getHistory(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        data:result

    });


});









/*
===================================================
CURRENT BRANCH
GET /api/git/:roomId/branch
===================================================
*/

export const currentBranch =
asyncHandler(
async(req,res)=>{


    const branch =
    await getCurrentBranch(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        branch

    });


});









/*
===================================================
GET ALL BRANCHES
GET /api/git/:roomId/branches
===================================================
*/

export const branches =
asyncHandler(
async(req,res)=>{


    const result =
    await getBranches(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        data:result

    });


});









/*
===================================================
CREATE BRANCH
POST /api/git/:roomId/branch
===================================================
*/

export const createNewBranch =
asyncHandler(
async(req,res)=>{


    const {

        branchName

    } = req.body;





    const result =
    await createBranch(

        req.params.roomId,

        branchName

    );





    res.status(200).json({

        success:true,

        message:
        "Branch created",

        data:result

    });


});









/*
===================================================
CHECKOUT BRANCH
PUT /api/git/:roomId/checkout
===================================================
*/

export const checkout =
asyncHandler(
async(req,res)=>{


    const {

        branchName

    } = req.body;





    const result =
    await checkoutBranch(

        req.params.roomId,

        branchName

    );





    res.status(200).json({

        success:true,

        message:
        "Branch switched",

        data:result

    });


});









/*
===================================================
DELETE BRANCH
DELETE /api/git/:roomId/branch
===================================================
*/

export const removeBranch =
asyncHandler(
async(req,res)=>{


    const {

        branchName

    } = req.body;





    const result =
    await deleteBranch(

        req.params.roomId,

        branchName

    );





    res.status(200).json({

        success:true,

        message:
        "Branch deleted",

        data:result

    });


});









/*
===================================================
GET DIFF
GET /api/git/:roomId/diff
===================================================
*/

export const diff =
asyncHandler(
async(req,res)=>{


    const result =
    await getDiff(

        req.params.roomId

    );





    res.status(200).json({

        success:true,

        data:result

    });


});









/*
===================================================
CHECK GIT AVAILABLE
GET /api/git/check
===================================================
*/

export const gitCheck =
asyncHandler(
async(req,res)=>{


    const result =
    await checkGit();





    res.status(200).json({

        success:true,

        data:result

    });


});