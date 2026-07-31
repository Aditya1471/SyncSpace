import api from "./api";

export async function executeCommand(
  roomId,
  command
) {

  const response =
    await api.post(
      "/terminal/execute",
      {
        roomId,
        command,
      }
    );

  return response.data;

}

export async function clearTerminal(
  roomId
) {

  const response =
    await api.post(
      "/terminal/clear",
      {
        roomId,
      }
    );

  return response.data;

}

export async function terminalHistory(
  roomId
) {

  const response =
    await api.get(
      `/terminal/history/${roomId}`
    );

  return response.data;

}