import "../css/Login.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCode,
  FaGoogle,
  FaGithub,
  FaArrowRight,
  FaUsers,
  FaLaptopCode,
  FaPaintBrush,
  FaShieldAlt,
} from "react-icons/fa";


function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      alert("Please enter Email and Password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: loginData.email,
          password: loginData.password,
        }
      );

      const { token, user, message } = response.data;

      if (loginData.remember) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      alert(message || "Login Successful!");

      navigate("/dashboard");

    } catch (error) {
  console.log("Status:", error.response?.status);
  console.log("Response:", error.response?.data);

  alert(error.response?.data?.message || "Login failed");
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Background */}

      <div className="login-bg"></div>

      <div className="login-wrapper">

        {/* LEFT SIDE */}

        <div className="login-info">

          <div className="brand">
            <FaCode />
            <h2>SyncSpace</h2>
          </div>

          <h1>
            Collaborate.
            <br />
            Code.
            <span>Create.</span>
          </h1>

          <p>
            A modern workspace where teams can collaborate,
            share ideas and build amazing products together.
          </p>

          <div className="info-cards">

            <div>
              <FaUsers />
              <span>Real Time Team Collaboration</span>
            </div>

            <div>
              <FaLaptopCode />
              <span>Live Code Workspace</span>
            </div>

            <div>
              <FaPaintBrush />
              <span>Interactive Whiteboard</span>
            </div>

            <div>
              <FaShieldAlt />
              <span>Secure Workspace</span>
            </div>

          </div>

        </div>

        {/* LOGIN BOX */}

        <div className="login-box">

          <div className="login-header">
            <h1>Welcome Back</h1>

            <p>Login to access your workspace</p>
          </div>

          <form onSubmit={handleSubmit}>
                        {/* EMAIL */}

            <div className="field">
              <FaEnvelope />

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}

            <div className="field">
              <FaLock />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={loginData.password}
                onChange={handleChange}
                required
              />

              <span
                className="password-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="login-extra">
              <label>
                <input
                  type="checkbox"
                  name="remember"
                  checked={loginData.remember}
                  onChange={handleChange}
                />

                Remember me
              </label>

              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  Login
                  <FaArrowRight />
                </>
              )}
            </button>

          </form>

          <div className="or">
            <span>OR</span>
          </div>

          <div className="social-login">

            <button type="button">
              <FaGoogle />
              Google
            </button>

            <button type="button">
              <FaGithub />
              GitHub
            </button>

          </div>

          <p className="register">
            Don't have an account?

            <Link to="/signup">
              Create Account
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;