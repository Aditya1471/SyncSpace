// src/pages/UserDashboard.jsx

import "../css/UserDashboard.css";
import { Link } from "react-router-dom";

import {
  FaHome,
  FaUsers,
  FaCode,
  FaPaintBrush,
  FaComments,
  FaFolderOpen,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaPlus,
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaCodeBranch,
  FaFire,
  FaRocket,
} from "react-icons/fa";

const stats = [
  {
    id: 1,
    icon: <FaUsers />,
    title: "Active Rooms",
    value: "12",
    color: "#6366f1",
  },
  {
    id: 2,
    icon: <FaCode />,
    title: "Live Editors",
    value: "47",
    color: "#0ea5e9",
  },
  {
    id: 3,
    icon: <FaPaintBrush />,
    title: "Whiteboards",
    value: "18",
    color: "#10b981",
  },
  {
    id: 4,
    icon: <FaFolderOpen />,
    title: "Shared Files",
    value: "426",
    color: "#f59e0b",
  },
];

const onlineUsers = [
  "Mahesh",
  "Aditya",
  "Rahul",
  "Priya",
  "Anjali",
];

export default function UserDashboard() {
  return (
    <div className="dashboard">

      {/* ================= Sidebar ================= */}

      <aside className="sidebar">

        <div>

          <div className="logo">

            <FaCodeBranch className="logo-icon" />

            <h2>SyncSpace</h2>

          </div>

          <ul className="menu">

            <li className="active">
              <FaHome />
              Dashboard
            </li>

            <li>

    <Link 
        to="/create-room"
        className="sidebar-link"
    >

        <FaUsers />

        <span>
            Rooms
        </span>

    </Link>

</li>

           <li>

    <Link 
        to="/code-editor"
        className="sidebar-link"
    >

        <FaCode />

        <span>
            Code Editor
        </span>

    </Link>

</li>

            <li>
  <Link to="/whiteboard" className="sidebar-link">

    <FaPaintBrush />

    <span>
      Whiteboard
    </span>

  </Link>
</li>

            <li>
              <FaComments />
              Team Chat
            </li>

            <li>
              <FaFolderOpen />
              Shared Files
            </li>

            <li>
              <FaChartLine />
              Analytics
            </li>

            <li>
              <FaCog />
              Settings
            </li>

          </ul>

        </div>

        <button className="logout-btn">
          <FaSignOutAlt />
          Logout
        </button>

      </aside>

      {/* ================= Main ================= */}

      <main className="main-content">

        {/* ================= Top Bar ================= */}

        <header className="topbar">

          <div className="search-box">

            <FaSearch />

            <input
              type="text"
              placeholder="Search Rooms..."
            />

          </div>

          <div className="top-right">

            <button className="notification">

              <FaBell />

            </button>

            <div className="profile">

              <img
                src=""
                alt=""
              />

              <div>

                <h4>User</h4>

                <span>Software Developer</span>

              </div>

            </div>

          </div>

        </header>

        {/* ================= Hero ================= */}

        <section className="hero">

          <div className="hero-left">

            <span className="hero-tag">

              <FaFire />

              Productivity +12%

            </span>

            <h1>

              Good Evening,

              <br />

              Mahesh 👋

            </h1>

            <p>

              Welcome back to SyncSpace.

              Collaborate with your teammates,
              code together, brainstorm ideas,
              and manage your projects in one place.

            </p>

            <div className="hero-buttons">

              <button className="primary-btn">

                <FaPlus />

                Create Room

              </button>

              <button className="secondary-btn">

                <FaArrowRight />

                Join Room

              </button>

            </div>

          </div>

          <div className="hero-right">

            <div className="hero-card">

              <h3>Online Team</h3>

              <div className="avatars">

                {onlineUsers.map((user, index) => (

                  <div
                    key={index}
                    className="avatar"
                  >
                    {user.charAt(0)}
                  </div>

                ))}

              </div>

              <p>23 Members Online</p>

            </div>

            <div className="hero-card">

              <FaCalendarAlt className="hero-icon" />

              <h3>Today's Meeting</h3>

              <p>Frontend Sprint Review</p>

              <small>02:00 PM</small>

            </div>

          </div>

        </section>

        {/* ================= Statistics ================= */}

        <section className="stats">

          {stats.map((item) => (

            <div
              className="stat-card"
              key={item.id}
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

        {/* ================= Continue in Part 2 ================= */}
                {/* ================= Workspace ================= */}

        <section className="workspace-section">

          <div className="section-header">

            <h2>Your Workspace</h2>

            <button className="view-all">
              View All
            </button>

          </div>

          <div className="workspace-grid">

            <div className="workspace-card purple">

              <div className="workspace-icon">

                <FaCode />

              </div>

              <h3>Live Code Editor</h3>

              <p>
                Collaborate with teammates in a
                real-time Monaco Editor.
              </p>

              <button>

                Open Editor

                <FaArrowRight />

              </button>

            </div>

            <div className="workspace-card blue">

              <div className="workspace-icon">

                <FaPaintBrush />

              </div>

              <h3>Collaborative Whiteboard</h3>

              <p>
                Draw diagrams, brainstorm ideas,
                and explain concepts visually.
              </p>

              <button>

                Open Board

                <FaArrowRight />

              </button>

            </div>

            <div className="workspace-card green">

              <div className="workspace-icon">

                <FaComments />

              </div>

              <h3>Team Chat</h3>

              <p>
                Chat instantly with your team while
                working together.
              </p>

              <button>

                Open Chat

                <FaArrowRight />

              </button>

            </div>

            <div className="workspace-card orange">

              <div className="workspace-icon">

                <FaVideo />

              </div>

              <h3>Video Meeting</h3>

              <p>
                Start HD meetings with screen sharing
                and collaboration tools.
              </p>

              <button>

                Start Meeting

                <FaArrowRight />

              </button>

            </div>

          </div>

        </section>





        {/* ================= Quick Actions ================= */}

        <section className="quick-section">

          <div className="section-header">

            <h2>Quick Actions</h2>

          </div>

          <div className="quick-grid">

            <div className="quick-card">

              <FaPlus />

              <h3>Create Room</h3>

              <p>
                Start a new collaboration room.
              </p>

            </div>

            <div className="quick-card">

              <FaCode />

              <h3>Start Coding</h3>

              <p>
                Open a collaborative code editor.
              </p>

            </div>

            <div className="quick-card">

              <FaPaintBrush />

              <h3>Whiteboard</h3>

              <p>
                Brainstorm and sketch together.
              </p>

            </div>

            <div className="quick-card">

              <FaVideo />

              <h3>Meeting</h3>

              <p>
                Launch an instant video call.
              </p>

            </div>

          </div>

        </section>






        {/* ================= Productivity ================= */}

        <section className="productivity">

          <div className="section-header">

            <h2>

              Weekly Productivity

            </h2>

            <span>

              Last 7 Days

            </span>

          </div>

          <div className="chart">

            <div className="bar">

              <div
                className="fill"
                style={{ height: "70%" }}
              ></div>

              <span>Mon</span>

            </div>

            <div className="bar">

              <div
                className="fill"
                style={{ height: "50%" }}
              ></div>

              <span>Tue</span>

            </div>

            <div className="bar">

              <div
                className="fill"
                style={{ height: "90%" }}
              ></div>

              <span>Wed</span>

            </div>

            <div className="bar">

              <div
                className="fill"
                style={{ height: "60%" }}
              ></div>

              <span>Thu</span>

            </div>

            <div className="bar">

              <div
                className="fill"
                style={{ height: "85%" }}
              ></div>

              <span>Fri</span>

            </div>

            <div className="bar">

              <div
                className="fill"
                style={{ height: "40%" }}
              ></div>

              <span>Sat</span>

            </div>

            <div className="bar">

              <div
                className="fill"
                style={{ height: "65%" }}
              ></div>

              <span>Sun</span>

            </div>

          </div>

        </section>






        {/* ================= Main Grid ================= */}

        <section className="dashboard-grid">

  {/* ================= Left Column ================= */}

  <div className="left-column">
                    {/* ================= Recent Rooms ================= */}

          <div className="card recent-rooms">

            <div className="section-header">

              <h2>Recent Rooms</h2>

              <button className="view-all">
                View All
              </button>

            </div>

            <div className="room-list">

              <div className="room-item">

                <div className="room-info">

                  <h3>🚀 React Team</h3>

                  <p>Live Code Editor</p>

                  <small>8 Members • Updated 2 mins ago</small>

                </div>

                <button className="join-btn">
                  Join
                </button>

              </div>

              <div className="room-item">

                <div className="room-info">

                  <h3>🎨 UI Designers</h3>

                  <p>Collaborative Whiteboard</p>

                  <small>5 Members • Updated 10 mins ago</small>

                </div>

                <button className="join-btn">
                  Join
                </button>

              </div>

              <div className="room-item">

                <div className="room-info">

                  <h3>💻 DSA Practice</h3>

                  <p>Interview Preparation</p>

                  <small>4 Members • Active Now</small>

                </div>

                <button className="join-btn">
                  Join
                </button>

              </div>

              <div className="room-item">

                <div className="room-info">

                  <h3>📱 Mobile Team</h3>

                  <p>Flutter Development</p>

                  <small>6 Members • Yesterday</small>

                </div>

                <button className="join-btn">
                  Join
                </button>

              </div>

            </div>

          </div>





          {/* ================= Team Progress ================= */}

          <div className="card progress-card">

            <div className="section-header">

              <h2>Project Progress</h2>

            </div>

            <div className="progress-item">

              <span>Frontend</span>

              <span>90%</span>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{ width: "90%" }}
              ></div>

            </div>

            <div className="progress-item">

              <span>Backend</span>

              <span>75%</span>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{ width: "75%" }}
              ></div>

            </div>

            <div className="progress-item">

              <span>Database</span>

              <span>82%</span>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{ width: "82%" }}
              ></div>

            </div>

            <div className="progress-item">

              <span>Testing</span>

              <span>65%</span>

            </div>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{ width: "65%" }}
              ></div>

            </div>

          </div>

        </div>





        {/* ================= Right Column ================= */}

        <div className="right-column">

          {/* Online Members */}

          <div className="card">

            <div className="section-header">

              <h2>Online Members</h2>

            </div>

            <div className="member-list">

              <div className="member">

                <div className="avatar green">M</div>

                <div>

                  <h4>Mahesh</h4>

                  <small>Working on Dashboard</small>

                </div>

                <span className="online-dot"></span>

              </div>

              <div className="member">

                <div className="avatar blue">A</div>

                <div>

                  <h4>Aditya</h4>

                  <small>Editing Backend</small>

                </div>

                <span className="online-dot"></span>

              </div>

              <div className="member">

                <div className="avatar purple">R</div>

                <div>

                  <h4>Rahul</h4>

                  <small>Whiteboard Session</small>

                </div>

                <span className="online-dot"></span>

              </div>

              <div className="member">

                <div className="avatar orange">P</div>

                <div>

                  <h4>Priya</h4>

                  <small>Design Review</small>

                </div>

                <span className="online-dot"></span>

              </div>

            </div>

          </div>





          {/* Today's Meetings */}

          <div className="card">

            <div className="section-header">

              <h2>Today's Meetings</h2>

            </div>

            <div className="meeting">

              <FaClock />

              <div>

                <h4>Frontend Standup</h4>

                <span>10:00 AM</span>

              </div>

            </div>

            <div className="meeting">

              <FaClock />

              <div>

                <h4>Backend Sync</h4>

                <span>2:00 PM</span>

              </div>

            </div>

            <div className="meeting">

              <FaClock />

              <div>

                <h4>Sprint Planning</h4>

                <span>5:30 PM</span>

              </div>

            </div>

          </div>





          {/* Recent Activity */}

          <div className="card">

            <div className="section-header">

              <h2>Recent Activity</h2>

            </div>

            <div className="activity">

              <div className="activity-item">

                <div className="activity-dot"></div>

                <div>

                  <h4>Mahesh created React Team</h4>

                  <small>2 minutes ago</small>

                </div>

              </div>

              <div className="activity-item">

                <div className="activity-dot"></div>

                <div>

                  <h4>Whiteboard Updated</h4>

                  <small>10 minutes ago</small>

                </div>

              </div>

              <div className="activity-item">

                <div className="activity-dot"></div>

                <div>

                  <h4>New File Uploaded</h4>

                  <small>25 minutes ago</small>

                </div>

              </div>

              <div className="activity-item">

                <div className="activity-dot"></div>

                <div>

                  <h4>Code Synced Successfully</h4>

                  <small>40 minutes ago</small>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      <footer className="dashboard-footer">

        <p>

          © 2026 SyncSpace • Real-Time Collaboration Platform

        </p>

      </footer>

    </main>

  </div>
);
}

