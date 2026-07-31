// server/routes/settingsRoutes.js

import express from "express";

import {
    getUserSettings,
    updateUserSettings,
    changeTheme,
    changeEditorOptions,
    resetUserSettings
} from "../controllers/settingsController.js";

import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();



/*
=================================================
SETTINGS ROUTES
=================================================
*/


/*
=================================================
GET USER SETTINGS
GET /api/settings
=================================================
*/

router.get(
    "/",
    protect,
    getUserSettings
);





/*
=================================================
UPDATE ALL SETTINGS
PUT /api/settings
=================================================
*/

router.put(
    "/",
    protect,
    updateUserSettings
);





/*
=================================================
CHANGE THEME
PUT /api/settings/theme
=================================================
*/

router.put(
    "/theme",
    protect,
    changeTheme
);





/*
=================================================
CHANGE EDITOR OPTIONS
PUT /api/settings/editor
=================================================
*/

router.put(
    "/editor",
    protect,
    changeEditorOptions
);





/*
=================================================
RESET SETTINGS
DELETE /api/settings/reset
=================================================
*/

router.delete(
    "/reset",
    protect,
    resetUserSettings
);





export default router;