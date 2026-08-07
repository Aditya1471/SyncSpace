import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Userdashboard.css";

import {
  FaHome,
  FaUserCircle,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaPlus,
  FaArrowRight,
  FaClock,
  FaRocket,
  FaCodeBranch,
  FaFire,
  FaHistory,
  FaUserFriends,
  FaCheckCircle,
  FaCircle,
  FaCode,
  FaPaintBrush,
} from "react-icons/fa";

function ProfileView({ username, displayUsername }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [email, setEmail] = useState(
    user?.email || ""
  );
  const [role, setRole] = useState("Lead Full Stack Developer");
  const [bio, setBio] = useState("Building the future of real-time collaborative development workspaces.");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="profile-view-container" style={{ padding: "2.5rem", background: "rgba(17, 24, 39, 0.65)", borderRadius: "18px", border: "1px solid rgba(255, 255, 255, 0.08)", marginTop: "2rem", backdropFilter: "blur(12px)" }}>
      <h2 style={{ color: "#f9fafb", marginBottom: "1.5rem", fontSize: "1.8rem", fontWeight: "700" }}>Developer Profile</h2>
      <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 250px", textAlign: "center", padding: "2.5rem", background: "rgba(15, 23, 42, 0.8)", borderRadius: "14px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <div style={{ width: "110px", height: "110px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "3.2rem", fontWeight: "bold", margin: "0 auto 1.2rem", boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}>
            {displayUsername.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ color: "#f9fafb", fontSize: "1.4rem", marginBottom: "0.4rem" }}>{displayUsername}</h3>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem" }}>{role}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", padding: "6px 12px", borderRadius: "20px", fontSize: "0.8rem", marginTop: "1.2rem" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></span> Active Member
          </div>
        </div>
        <form onSubmit={handleSave} style={{ flex: "2 2 400px", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div>
            <label style={{ display: "block", color: "#9ca3af", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Username</label>
            <input type="text" value={username} disabled style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(3, 7, 18, 0.4)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", color: "#6b7280", cursor: "not-allowed" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "#9ca3af", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Display Name</label>
            <input type="text" value={displayUsername} disabled style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(3, 7, 18, 0.4)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", color: "#6b7280", cursor: "not-allowed" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "#9ca3af", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(3, 7, 18, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", color: "#f9fafb" }} />
          </div>
          <div>
            <label style={{ display: "block", color: "#9ca3af", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3" style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(3, 7, 18, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", color: "#f9fafb", resize: "none" }} />
          </div>
          <button type="submit" style={{ alignSelf: "flex-start", padding: "0.8rem 2rem", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)" }}>
            Save Profile Changes
          </button>
          {saved && <span style={{ color: "#10b981", fontSize: "0.95rem", fontWeight: "500" }}>✓ Profile saved successfully!</span>}
        </form>
      </div>
    </div>
  );
}

function SettingsView() {
  const [theme, setTheme] = useState("VS-Dark (Default)");
  const [syncDelay, setSyncDelay] = useState("Real-time (0ms)");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-view-container" style={{ padding: "2.5rem", background: "rgba(17, 24, 39, 0.65)", borderRadius: "18px", border: "1px solid rgba(255, 255, 255, 0.08)", marginTop: "2rem", backdropFilter: "blur(12px)" }}>
      <h2 style={{ color: "#f9fafb", marginBottom: "1.5rem", fontSize: "1.8rem", fontWeight: "700" }}>Workspace Settings</h2>
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "600px" }}>
        <div>
          <label style={{ display: "block", color: "#9ca3af", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Editor Theme Preference</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(3, 7, 18, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", color: "#f9fafb", cursor: "pointer" }}>
            <option>VS-Dark (Default)</option>
            <option>Monokai Pro</option>
            <option>Github Dark</option>
            <option>Dracula</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", color: "#9ca3af", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500" }}>Socket Sync Mode</label>
          <select value={syncDelay} onChange={(e) => setSyncDelay(e.target.value)} style={{ width: "100%", padding: "0.8rem 1rem", background: "rgba(3, 7, 18, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", color: "#f9fafb", cursor: "pointer" }}>
            <option>Real-time (0ms)</option>
            <option>Debounced (200ms)</option>
            <option>On-demand</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "0.5rem" }}>
          <input type="checkbox" id="notify" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} style={{ width: "18px", height: "18px", accentColor: "#6366f1", cursor: "pointer" }} />
          <label htmlFor="notify" style={{ color: "#f9fafb", cursor: "pointer", userSelect: "none", fontSize: "0.95rem" }}>Enable sound alerts for new peer messages</label>
        </div>
        <button type="submit" style={{ alignSelf: "flex-start", padding: "0.8rem 2rem", background: "linear-gradient(135deg, #6366f1, #4f46e5)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)" }}>
          Apply System Settings
        </button>
        {saved && <span style={{ color: "#10b981", fontSize: "0.95rem", fontWeight: "500" }}>✓ Workspace settings updated!</span>}
      </form>
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toastMsg, setToastMsg] = useState("");
  useEffect(() => {
    const msg = localStorage.getItem("loginSuccess");

    if (msg) {
      setToastMsg(msg);
      localStorage.removeItem("loginSuccess");

      setTimeout(() => {
        setToastMsg("");
      }, 3000);
    }
  }, []);

  // ===========================
  // User Data
  // ===========================

  const username =
    localStorage.getItem("syncspace_user") || "Aditya";

  const displayUsername = username === "aditya.jha.12" ? "Aditya" : (
    username.split('.')[0].split('_')[0].charAt(0).toUpperCase() + 
    username.split('.')[0].split('_')[0].slice(1)
  );

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    }

    if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    }

    if (hour >= 17 && hour < 21) {
      return "Good Evening";
    }

    return "Welcome Back";
  };

  const stats = [
    {
      id: 1,
      title: "Rooms Created",
      value: "18",
      icon: <FaUsers />,
      color: "#6366f1",
    },
    {
      id: 2,
      title: "Rooms Joined",
      value: "46",
      icon: <FaUserFriends />,
      color: "#06b6d4",
    },
    {
      id: 3,
      title: "Projects",
      value: "12",
      icon: <FaRocket />,
      color: "#10b981",
    },
    {
      id: 4,
      title: "Hours",
      value: "328",
      icon: <FaClock />,
      color: "#f59e0b",
    },
  ];

  const recentRooms = [
    {
      id: 1,
      room: "React Development",
      members: 8,
      updated: "2 mins ago",
      status: "Active",
    },
    {
      id: 2,
      room: "Backend API",
      members: 5,
      updated: "12 mins ago",
      status: "Online",
    },
    {
      id: 3,
      room: "Placement Prep",
      members: 4,
      updated: "30 mins ago",
      status: "Active",
    },
    {
      id: 4,
      room: "College Project",
      members: 6,
      updated: "Yesterday",
      status: "Offline",
    },
  ];

  const activities = [
    "Created a new room",
    "Joined Backend API",
    "Started collaboration",
    "Shared project ideas",
    "Updated workspace",
  ];

  // ===========================
  // Logout
  // ===========================

  const handleLogout = () => {
    localStorage.removeItem("syncspace_user");
    navigate("/");
  };

  return (
    <div className="dashboard">
      {toastMsg && (
        <div className="toast">
          {toastMsg}
        </div>
      )}

      {/* ================================= */}
      {/* Sidebar */}
      {/* ================================= */}

      <aside className="sidebar">
  <div>
    {/* Logo */}
    <div className="logo">
      <FaCodeBranch className="logo-icon" />
      <h2>SyncSpace</h2>
    </div>

    {/* Sidebar Menu */}
    <ul className="menu">

      {/* Dashboard */}
      <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")} style={{ cursor: "pointer" }}>
        <FaHome />
        <span>Dashboard</span>
      </li>

      {/* Rooms */}
      <li>
        <Link to="/rooms" className="sidebar-link">
          <FaUsers />
          <span>Rooms</span>
        </Link>
      </li>

      {/* Code Editor */}
      <li>
        <Link to="/code-editor" className="sidebar-link">
          <FaCode />
          <span>Code Editor</span>
        </Link>
      </li>

      {/* Whiteboard */}
      <li>
        <Link to="/whiteboard" className="sidebar-link">
          <FaPaintBrush />
          <span>Whiteboard</span>
        </Link>
      </li>

      {/* Profile */}
      <li className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")} style={{ cursor: "pointer" }}>
        <FaUserCircle />
        <span>Profile</span>
      </li>

      {/* Settings */}
      <li className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")} style={{ cursor: "pointer" }}>
        <FaCog />
        <span>Settings</span>
      </li>

    </ul>
  </div>

  {/* Logout */}
  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    <FaSignOutAlt />
    Logout
  </button>
</aside>
      {/* ================================= */}
      {/* Main */}
      {/* ================================= */}

      <main className="main-content">

        {/* ================================= */}
        {/* Topbar */}
        {/* ================================= */}

        <header className="topbar">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search rooms..."
            />

          </div>

          <div className="topbar-right">

            <button className="notification-btn">

              <FaBell />

            </button>

            <div className="profile-box">

              <div className="profile-avatar">

                {displayUsername.charAt(0).toUpperCase()}

              </div>

              <div>

                <h4>{displayUsername}</h4>

                <span>Full Stack Developer</span>

              </div>

            </div>

          </div>

        </header>

        {activeTab === "dashboard" && (
          <>
            {/* ================================= */}
            {/* Hero Section */}
            {/* ================================= */}

            <section className="hero">

          <div className="hero-left">

            <span className="hero-tag">

              <FaFire />

              Welcome Back

            </span>

            <h1>

              {getGreeting()},

              <br />

              {displayUsername} 👋

            </h1>

            <p>

              Manage your collaborative rooms,
              create new workspaces,
              and continue building projects with
              your teammates.

            </p>

            <div className="hero-buttons">

              <Link to="/rooms">

                <button className="primary-btn">

                  <FaPlus />

                  Create Room

                </button>

              </Link>

              <Link to="/rooms">

                <button className="secondary-btn">

                  <FaArrowRight />

                  Join Room

                </button>

              </Link>

            </div>

          </div>

          <div className="hero-right">

            <div className="profile-card">

              <div className="big-avatar">

                {displayUsername.charAt(0).toUpperCase()}

              </div>

              <h3>{displayUsername}</h3>

              <p>Full Stack Developer</p>

              <div className="status">

                <FaCircle />

                Online

              </div>

            </div>

          </div>

        </section>

        {/* ================================= */}
        {/* Statistics */}
        {/* ================================= */}

        <section className="stats">

          {stats.map((item) => (

            <div
              key={item.id}
              className="stat-card"
            >

              <div
                className="stat-icon"
                style={{
                  background: item.color,
                }}
              >

                {item.icon}

              </div>

              <div>

                <h2>{item.value}</h2>

                <p>{item.title}</p>

              </div>

            </div>

          ))}

        </section>

        {/* Continue in Part 1B */}
                {/* ================================= */}
        {/* Workspace Section */}
        {/* ================================= */}

       <section className="workspace-section">

  <div className="section-header">

    <div>
      <h2>Recent Rooms</h2>

      <p>
        Continue your previous collaborations
      </p>
    </div>

    <div className="view-all-btn">
      View All
      <FaArrowRight />
    </div>

  </div>

  <div className="rooms-grid">

    {recentRooms.map((room) => (

      <div
        className="room-card"
        key={room.id}
      >

        <div className="room-top">

          <div className="room-icon">
            <FaUsers />
          </div>

          <span
            className={
              room.status === "Offline"
                ? "offline"
                : "online"
            }
          >
            <FaCircle />
            {room.status}
          </span>

        </div>

        <h3>{room.room}</h3>

        <div className="room-info">

          <span>
            <FaUserFriends />
            {room.members} Members
          </span>

          <span>
            <FaClock />
            {room.updated}
          </span>

        </div>

        <button
          className="enter-room"
        >
          Enter Room
          <FaArrowRight />
        </button>

      </div>

    ))}

  </div>

</section>




        {/* ================================= */}
        {/* Quick Actions */}
        {/* ================================= */}


        <section className="quick-section">


          <div className="section-header">


            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Start working instantly
              </p>

            </div>


          </div>



          <div className="quick-grid">


            <div
              className="quick-card"
              onClick={()=>
                navigate("/rooms")
              }
            >

              <FaPlus />


              <h3>
                Create Room
              </h3>


              <p>
                Start a new collaboration space
              </p>


            </div>




            <div
              className="quick-card"
              onClick={()=>
                navigate("/code-editor")
              }
            >


              <FaCodeBranch />


              <h3>
                Code Editor
              </h3>


              <p>
                Write and execute code together
              </p>


            </div>





            <div
              className="quick-card"
              onClick={()=>
                navigate("/whiteboard")
              }
            >


              <FaRocket />


              <h3>
                Whiteboard
              </h3>


              <p>
                Visualize your ideas
              </p>


            </div>



          </div>


        </section>





        {/* ================================= */}
        {/* Activity Timeline */}
        {/* ================================= */}



        <section className="activity-section">


          <div className="section-header">


            <div>

              <h2>
                Recent Activity
              </h2>


              <p>
                Your latest workspace actions
              </p>


            </div>


          </div>




          <div className="activity-card">


            {
              activities.map((activity,index)=>(


                <div
                  className="activity-item"
                  key={index}
                >


                  <div className="activity-icon">

                    <FaCheckCircle />

                  </div>


                  <div>


                    <h4>
                      {activity}
                    </h4>


                    <span>

                      {index+1} hours ago

                    </span>


                  </div>


                </div>


              ))
            }


          </div>


        </section>
          </>
        )}

        {activeTab === "profile" && (
          <ProfileView username={username} displayUsername={displayUsername} />
        )}

        {activeTab === "settings" && (
          <SettingsView />
        )}
      </main>


    </div>
  );
}