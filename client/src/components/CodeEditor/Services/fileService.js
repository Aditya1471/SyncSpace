import api from "./api";

export async function getFiles(roomId) {

  const response =
    await api.get(`/files/${roomId}`);

  return response.data;

}

export async function saveFile(
  roomId,
  file
) {

  const response =
    await api.post(
      `/files/${roomId}`,
      file
    );

  return response.data;

}

export async function deleteFile(
  roomId,
  fileId
) {

  const response =
    await api.delete(
      `/files/${roomId}/${fileId}`
    );

  return response.data;

}

export async function renameFile(
  roomId,
  fileId,
  name
) {

  const response =
    await api.patch(
      `/files/${roomId}/${fileId}`,
      {
        name,
      }
    );

  return response.data;

}

export async function createFolder(
  roomId,
  folder
) {

  const response =
    await api.post(
      `/folders/${roomId}`,
      folder
    );

  return response.data;

}