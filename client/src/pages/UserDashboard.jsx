// src/pages/UserDashboard.jsx

import React from "react";
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
} from "react-icons/fa";

export default function UserDashboard() {
  const navigate = useNavigate();

  // ===========================
  // User Data
  // ===========================

  const username =
    localStorage.getItem("syncspace_user") || "Mahesh";

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

      {/* ================================= */}
      {/* Sidebar */}
      {/* ================================= */}

      <aside className="sidebar">

        <div>

          <div className="logo">

            <FaCodeBranch className="logo-icon" />

            <h2>SyncSpace</h2>

          </div>

          <ul className="menu">

            <li className="active">

              <FaHome />

              <span>Dashboard</span>

            </li>

            <li>

              <Link
                to="/rooms"
                className="sidebar-link"
              >

                <FaUsers />

                <span>Rooms</span>

              </Link>

            </li>

            <li>

              <Link
                to="/profile"
                className="sidebar-link"
              >

                <FaUserCircle />

                <span>Profile</span>

              </Link>

            </li>

            <li>

              <Link
                to="/settings"
                className="sidebar-link"
              >

                <FaCog />

                <span>Settings</span>

              </Link>

            </li>

          </ul>

        </div>

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

                {username.charAt(0).toUpperCase()}

              </div>

              <div>

                <h4>{}</h4>

                <span>Full Stack Developer</span>

              </div>

            </div>

          </div>

        </header>

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

              Good Evening,

              <br />

              {} 👋

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

                {username.charAt(0).toUpperCase()}

              </div>

              <h3>{username}</h3>

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

              <h2>
                Recent Rooms
              </h2>

              <p>
                Continue your previous collaborations
              </p>

            </div>


            <Link to="/rooms">

              View All
              <FaArrowRight />

            </Link>


          </div>



          <div className="rooms-grid">


            {recentRooms.map((room)=>(
              

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
                      room.status==="Offline"
                      ?
                      "offline"
                      :
                      "online"
                    }
                  >

                    <FaCircle />

                    {room.status}

                  </span>


                </div>



                <h3>

                  {room.room}

                </h3>


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
                  onClick={()=>
                    navigate(`/room/${room.id}`)
                  }
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





      </main>


    </div>
  );
}