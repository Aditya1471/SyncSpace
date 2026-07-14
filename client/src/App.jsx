import { useState, useEffect } from "react";
     import { io } from "socket.io-client"; // Import socket.io
    import CodeEditor from "./components/CodeEditor";
    
     // Connect to the server running on port 5000
     const socket = io("http://localhost:5000");
    
     function App() {
       const [code, setCode] = useState("// Start coding...");
   
      useEffect(() => {
        // Join a default room so we can sync with others
        socket.emit("join-room", { roomId: "default-room", username: "User" });
   
       // Listen for code changes from the server
        socket.on("code-change", (newCode) => {
          setCode(newCode);
        });
   
       return () => socket.off("code-change");
      }, []);
   
      const handleCodeChange = (newCode) => {
       setCode(newCode);
       // Send the change to the server to broadcast to other users
       socket.emit("code-change", { roomId: "default-room", code: newCode });
      };
   
      return (
        <CodeEditor
          language="javascript"
         value={code}
          onChange={handleCodeChange}
        />
     );
   }