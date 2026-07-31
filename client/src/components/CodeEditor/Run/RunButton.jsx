import { useState } from "react";
import {
  Play,
  Square,
  Loader2,
} from "lucide-react";

import { runCode } from "../Services/runService";

import "./Run.css";

export default function RunButton({
  language,
  code,
  onOutput,
}) {

  const [running, setRunning] = useState(false);

  const execute = async () => {

    if (running) return;

    setRunning(true);

    try {

      const result = await runCode({
        language,
        code,
      });

      onOutput?.({
        type: "success",
        message: result.output || "Execution completed.",
      });

    } catch (error) {

      onOutput?.({
        type: "error",
        message:
          error.response?.data?.message ||
          error.message ||
          "Execution failed.",
      });

    } finally {

      setRunning(false);

    }

  };

  return (

    <button
      className="run-button"
      onClick={execute}
      disabled={running}
    >

      {
        running ?

        <>

          <Loader2
            className="spin"
            size={16}
          />

          Running...

        </>

        :

        <>

          <Play
            size={16}
          />

          Run

        </>

      }

    </button>

  );

}