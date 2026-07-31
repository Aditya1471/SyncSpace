import api from "./api";

export async function runCode({
  language,
  code,
  input = "",
}) {

  const response = await api.post(
    "/code/run",
    {
      language,
      code,
      input,
    }
  );

  return response.data;
}

export async function getSupportedLanguages() {

  const response =
    await api.get("/code/languages");

  return response.data;

}