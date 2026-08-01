import api from "../api/axios";


// ===============================
// Get Git status
// GET /api/git/status
// ===============================

export const getGitStatus = async () => {

    try {

        const response = await api.get(
            "/git/status"
        );


        return response.data;


    } catch(error) {


        console.error(
            "Git status error:",
            error.response?.data || error.message
        );


        return {
            changedFiles:0
        };

    }

};



// ===============================
// Get Notifications
// GET /api/notifications
// ===============================

export const getNotifications = async () => {

    try {

        const response = await api.get(
            "/notifications"
        );


        return response.data;


    } catch(error) {


        console.error(
            "Notification error:",
            error.response?.data || error.message
        );


        return {
            count:0
        };

    }

};