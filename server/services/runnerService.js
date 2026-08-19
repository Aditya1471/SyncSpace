import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

import { TEMP_RUN_PATH } from "../utils/constants.js";

const execAsync = promisify(exec);

/*
===================================================
CREATE TEMP DIRECTORY
===================================================
*/
const createTempDirectory = async () => {
  const id = crypto.randomBytes(6).toString("hex");
  const folder = path.join(TEMP_RUN_PATH, id);

  await fs.mkdir(folder, { recursive: true });
  return folder;
};

/*
===================================================
RUN JAVASCRIPT
===================================================
*/
const runJavaScript = async (code, folder) => {
  const file = path.join(folder, "main.js");
  await fs.writeFile(file, code);

  return await execAsync(`node "${file}"`, { timeout: 5000 });
};

/*
===================================================
RUN PYTHON
===================================================
*/
const runPython = async (code, folder) => {
  const file = path.join(folder, "main.py");
  await fs.writeFile(file, code);

  const pythonCmd = process.platform === "win32" ? "python" : "python3";
  return await execAsync(`${pythonCmd} "${file}"`, { timeout: 5000 });
};

/*
===================================================
RUN JAVA (DYNAMIC CLASS & FILENAME DETECTOR)
===================================================
*/
const runJava = async (code, folder, filename = "") => {
  // 1. Extract public class name from code if present
  const publicClassMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
  // 2. Extract class containing main method if public class is missing
  const mainClassMatch = code.match(/class\s+([A-Za-z0-9_]+)[\s\S]*?public\s+static\s+void\s+main/);

  let className = "Main";

  if (publicClassMatch) {
    className = publicClassMatch[1];
  } else if (mainClassMatch) {
    className = mainClassMatch[1];
  } else if (filename) {
    // 3. Fall back to imported filename (e.g. "Calculator.java" -> "Calculator")
    className = path.parse(filename).name;
  }

  const file = path.join(folder, `${className}.java`);
  await fs.writeFile(file, code);

  // Compile Java file matching class name
  await execAsync(`javac "${file}"`);

  // Run compiled class bytecode
  return await execAsync(`java -cp "${folder}" ${className}`, { timeout: 5000 });
};

/*
===================================================
RUN C++
===================================================
*/
const runCpp = async (code, folder) => {
  const file = path.join(folder, "main.cpp");
  const output = path.join(folder, process.platform === "win32" ? "main.exe" : "main");

  await fs.writeFile(file, code);
  await execAsync(`g++ "${file}" -o "${output}"`);

  return await execAsync(`"${output}"`, { timeout: 5000 });
};

/*
===================================================
MAIN RUNNER
===================================================
*/
export const runCode = async ({ language, code, filename }) => {
  if (!language || !code) {
    throw new Error("Language and code required");
  }

  const folder = await createTempDirectory();

  try {
    let result;

    switch (language.toLowerCase()) {
      case "javascript":
      case "js":
        result = await runJavaScript(code, folder);
        break;

      case "python":
      case "py":
        result = await runPython(code, folder);
        break;

      case "java":
        result = await runJava(code, folder, filename);
        break;

      case "cpp":
      case "c++":
        result = await runCpp(code, folder);
        break;

      default:
        throw new Error("Language not supported");
    }

    return {
      success: true,
      output: result.stdout || result.stderr || "Executed with no output.",
      error: result.stderr || ""
    };
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error.stderr || error.message
    };
  } finally {
    await fs.rm(folder, { recursive: true, force: true }).catch(() => {});
  }
};