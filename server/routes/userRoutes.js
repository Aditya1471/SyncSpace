// server/routes/userRoutes.js

import express from "express";


import {

    getCurrentUser,

    getUsers,

    getUserById,

    searchUsers,

    updateUser,

    updateAvatar,

    changePassword,

    deleteUser,

    deleteAccount

} from "../controllers/userController.js";


import { protect } from "../middleware/authMiddleware.js";



const router = express.Router();





/*
=================================================
USER PROFILE ROUTES
=================================================
*/



// ==============================================
// GET CURRENT LOGGED-IN USER
// GET /api/users/me
// ==============================================

router.get(

    "/me",

    protect,

    getCurrentUser

);







// ==============================================
// UPDATE OWN PROFILE
// PUT /api/users/profile
// ==============================================

router.put(

    "/profile",

    protect,

    updateUser

);







// ==============================================
// CHANGE PASSWORD
// PUT /api/users/change-password
// ==============================================

router.put(

    "/change-password",

    protect,

    changePassword

);







// ==============================================
// DELETE OWN ACCOUNT
// DELETE /api/users/account
// ==============================================

router.delete(

    "/account",

    protect,

    deleteAccount

);









/*
=================================================
ADMIN / USER MANAGEMENT ROUTES
=================================================
*/



// ==============================================
// GET ALL USERS
// GET /api/users
// ==============================================

router.get(

    "/",

    protect,

    getUsers

);







// ==============================================
// SEARCH USERS
// GET /api/users/search?query=name
// ==============================================

router.get(

    "/search",

    protect,

    searchUsers

);







// ==============================================
// GET USER BY ID
// GET /api/users/:id
// ==============================================

router.get(

    "/:id",

    protect,

    getUserById

);







// ==============================================
// UPDATE USER BY ID
// PUT /api/users/:id
// ==============================================

router.put(

    "/:id",

    protect,

    updateUser

);







// ==============================================
// UPDATE USER AVATAR
// PUT /api/users/:id/avatar
// ==============================================

router.put(

    "/:id/avatar",

    protect,

    updateAvatar

);







// ==============================================
// DELETE USER
// DELETE /api/users/:id
// ==============================================

router.delete(

    "/:id",

    protect,

    deleteUser

);







export default router;