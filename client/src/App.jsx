import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ============================
// Pages
// ============================
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import RoomLanding from "./pages/RoomLanding";
import RoomWorkspace from "./pages/RoomWorkspace";
import CodeEditorPage from "./pages/CodeEditorPage";

// ============================
// Whiteboard
// ============================
import Whiteboard from "./components/Whiteboard/Whiteboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========================================= */}
        {/* Landing */}
        {/* ========================================= */}
        <Route path="/" element={<LandingPage />} />

        {/* ========================================= */}
        {/* Authentication */}
        {/* ========================================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ========================================= */}
        {/* Dashboard */}
        {/* ========================================= */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* ========================================= */}
        {/* Room Pages */}
        {/* ========================================= */}
        <Route path="/rooms" element={<RoomLanding />} />
        <Route path="/roomlanding" element={<RoomLanding />} />

        {/* ========================================= */}
        {/* Workspace */}
        {/* ========================================= */}
        <Route
          path="/workspace/:roomId"
          element={<RoomWorkspace />}
        />

        {/* ========================================= */}
        {/* Standalone Code Editor */}
        {/* ========================================= */}
        <Route
          path="/code-editor"
          element={<CodeEditorPage />}
        />

        {/* ========================================= */}
        {/* Collaborative Code Editor */}
        {/* ========================================= */}
        <Route
          path="/code-editor/:roomId"
          element={<CodeEditorPage />}
        />

        {/* ========================================= */}
        {/* Standalone Whiteboard */}
        {/* ========================================= */}
        <Route
          path="/whiteboard"
          element={
            <div
              style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
              }}
            >
              <Whiteboard />
            </div>
          }
        />

        {/* ========================================= */}
        {/* Collaborative Whiteboard */}
        {/* ========================================= */}
        <Route
          path="/whiteboard/:roomId"
          element={
            <div
              style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
              }}
            >
              <Whiteboard />
            </div>
          }
        />

        {/* ========================================= */}
        {/* Redirect */}
        {/* ========================================= */}
        <Route
          path="/workspace"
          element={<Navigate to="/rooms" replace />}
        />

        {/* ========================================= */}
        {/* 404 */}
        {/* ========================================= */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;