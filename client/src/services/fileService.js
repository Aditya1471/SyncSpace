import api from "../api/axios";


// ===============================
// Get all workspace files
// GET /api/files
// ===============================
export const getFiles = async () => {

    try {

        const response = await api.get(
            "/files"
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get files error:",
            error.response?.data || error.message
        );

        throw error;

    }

};



// ===============================
// Get single file
// GET /api/files/:id
// ===============================
export const getFileById = async (fileId) => {

    try {

        const response = await api.get(
            `/files/${fileId}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Get file error:",
            error.response?.data || error.message
        );

        throw error;

    }

};



// ===============================
// Create new file
// POST /api/files
// ===============================
export const createFile = async (fileData) => {

    try {

        const response = await api.post(
            "/files",
            fileData
        );

        return response.data;

    } catch (error) {

        console.error(
            "Create file error:",
            error.response?.data || error.message
        );

        throw error;

    }

};



// ===============================
// Update file
// PUT /api/files/:id
// ===============================
export const updateFile = async (
    fileId,
    fileData
) => {

    try {

        const response = await api.put(
            `/files/${fileId}`,
            fileData
        );

        return response.data;

    } catch (error) {

        console.error(
            "Update file error:",
            error.response?.data || error.message
        );

        throw error;

    }

};



// ===============================
// Delete file
// DELETE /api/files/:id
// ===============================
export const deleteFile = async (fileId) => {

    try {

        const response = await api.delete(
            `/files/${fileId}`
        );

        return response.data;

    } catch (error) {

        console.error(
            "Delete file error:",
            error.response?.data || error.message
        );

        throw error;

    }

};



// ===============================
// Upload file
// POST /api/files/upload
// ===============================
export const uploadFile = async (formData) => {

    try {

        const response = await api.post(
            "/files/upload",
            formData,
            {
                headers:{
                    "Content-Type":
                    "multipart/form-data"
                }
            }
        );


        return response.data;


    } catch(error){

        console.error(
            "Upload error:",
            error.response?.data || error.message
        );

        throw error;

    }

};