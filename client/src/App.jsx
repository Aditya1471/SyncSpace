import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import RoomLanding from "./pages/RoomLanding";
import RoomWorkspace from "./pages/RoomWorkspace";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* Create / Join Room */}
        <Route path="/rooms" element={<RoomLanding />} />
        {/* Alias to support /roomlanding direct navigation */}
        <Route path="/roomlanding" element={<RoomLanding />} />

        {/* Redirect if no roomId is provided */}
        <Route
          path="/workspace"
          element={<Navigate to="/rooms" replace />}
        />

        {/* Workspace with active Room ID */}
        <Route
          path="/workspace/:roomId"
          element={<RoomWorkspace />}
        />

        {/* Catch-all 404 Fallback */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;