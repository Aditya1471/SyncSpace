import "../css/LandingPage.css";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaArrowRight,
  FaUsers,
  FaPaintBrush,
  FaComments,
  FaRocket,
  FaCheckCircle,
  FaShieldAlt,
  FaBolt, // <-- Replaced FaZap with FaBolt from react-icons/fa
} from "react-icons/fa";

function LandingPage() {
  return (
    <div className="landing">

      {/* ================= BACKGROUND GLOWS ================= */}
      <div className="bg-glow glow-top-left"></div>
      <div className="bg-glow glow-bottom-right"></div>

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="logo">
          <div className="logo-icon-wrapper">
            <FaCode />
          </div>
          <span>SyncSpace</span>
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <div className="nav-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>

          <Link to="/signup">
            <button className="start-btn">Get Started</button>
          </Link>
        </div>

      </header>

      {/* ================= HERO ================= */}

      <section className="hero" id="home">

        <div className="hero-left">

          <span className="hero-tag">
            <FaRocket className="rocket-icon" />
            <span>Next-Gen Collaboration Platform</span>
          </span>

          <h1>
            Build.
            <br />
            Collaborate.
            <br />
            <span className="gradient-text">Create Together.</span>
          </h1>

          <p>
            SyncSpace empowers developers, creators, and remote teams to build together seamlessly in real time. Combine live code execution, collaborative whiteboards, instant chat, and enterprise-grade workspaces in one unified hub.
          </p>

          <div className="hero-buttons">

            <Link to="/signup">
              <button className="hero-btn">
                <span>Get Started</span>
                <FaArrowRight />
              </button>
            </Link>

            <Link to="/login">
              <button className="outline-btn">
                Login
              </button>
            </Link>

          </div>

          <div className="hero-stats">

            <div className="stat-box">
              <h2>10K+</h2>
              <span>Developers</span>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-box">
              <h2>5K+</h2>
              <span>Projects</span>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-box">
              <h2>99.9%</h2>
              <span>Uptime</span>
            </div>

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="hero-right">

          <div className="editor-card">

            <div className="editor-header">
              <div className="window-dots">
                <span className="red"></span>
                <span className="yellow"></span>
                <span className="green"></span>
              </div>
              <div className="editor-title">main.js — SyncSpace</div>
            </div>

            <div className="editor-body">

              <pre><code>{`const room = "SyncSpace";

socket.join(room);

editor.sync();

whiteboard.draw();

chat.send("Hello Team!");

project.deploy();`}</code></pre>

            </div>

          </div>

          <div className="floating-card top-card">
            <div className="floating-icon live-icon">
              <FaBolt /> {/* <-- Used FaBolt here */}
            </div>
            <div className="floating-text">
              <strong>Live Syncing</strong>
              <small>Zero Latency</small>
            </div>
          </div>

          <div className="floating-card bottom-card">
            <div className="floating-icon chat-icon">
              <FaComments />
            </div>
            <div className="floating-text">
              <strong>Team Chat</strong>
              <small>Active Workspace</small>
            </div>
          </div>

        </div>

      </section>

      {/* ================= FEATURES ================= */}

      <section className="features" id="features">

        <div className="section-heading">

          <span className="section-badge">Capabilities</span>
          <h2>Everything You Need</h2>

          <p>
            An end-to-end suit of productivity tools designed specifically for modern technical teams and creators.
          </p>

        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">
              <FaCode />
            </div>
            <h3>Code Editor</h3>
            <p>
              Collaborate live across JavaScript, Python, Java, C++, and 20+ other languages with real-time cursor tracking and syntax highlighting.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaPaintBrush />
            </div>
            <h3>Whiteboard</h3>
            <p>
              Sketch complex architectures, map out user flows, draw diagrams, and brainstorm visually on a shared infinite canvas.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaComments />
            </div>
            <h3>Live Chat</h3>
            <p>
              Integrated contextual communication tools keep discussions organized directly alongside your code and designs.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <FaUsers />
            </div>
            <h3>Team Workspace</h3>
            <p>
              Manage role permissions, invite teammates with a single secure link, and preserve project state effortlessly.
            </p>
          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="cta">

        <div className="cta-content">
          <h2>Ready to build together?</h2>

          <p>
            Join thousands of developers and teams already collaborating on SyncSpace.
          </p>

          <div className="cta-perks">
            <span><FaCheckCircle /> Free Plan Available</span>
            <span><FaShieldAlt /> Enterprise Security</span>
          </div>

          <Link to="/signup">
            <button className="cta-btn">
              Start for Free
            </button>
          </Link>
        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="footer" id="about">

        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon-wrapper">
                <FaCode />
              </div>
              <span>SyncSpace</span>
            </div>
            <p>Build • Collaborate • Innovate</p>
          </div>

          <div className="footer-meta">
            <small>© 2026 SyncSpace. All Rights Reserved.</small>
          </div>
        </div>

      </footer>

    </div>
  );
}

export default LandingPage;