import "../css/Signup.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


import {
  FaUser,
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
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const getStrength = () => {
    const password = formData.password;

    if (password.length === 0) return 0;

    if (password.length < 6) return 25;

    if (password.length < 8) return 50;

    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    ) {
      return 100;
    }

    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return 75;
    }

    return 50;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password should contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!formData.agree) {
      alert("Please accept the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("🎉 Account created successfully!");

      navigate("/login");
    } 
    catch (error) {
  console.log("========== SIGNUP ERROR ==========");
  console.log("Status:", error.response?.status);
  console.log("Response:", error.response?.data);
  console.log("Full Error:", error);
  console.log("==================================");

  if (error.response) {
    alert(error.response.data.message);
  } else {
    alert("Unable to connect to server.");
  }
}
finally {
      setLoading(false);
    }
  };
    return (
    <div className="signup-page">
      <div className="signup-wrapper">

        {/* LEFT SECTION */}

        <div className="signup-info">
          <div className="brand">
            <FaCode />
            <h2>SyncSpace</h2>
          </div>

          <h1>
            Build.
            <br />
            Connect.
            <br />
            <span>Collaborate.</span>
          </h1>

          <p>
            Create your account and join a powerful workspace where developers,
            students and teams can collaborate in real time.
          </p>

          <div className="signup-features">

            <div>
              <FaUsers />
              <span>Real-Time Collaboration</span>
            </div>

            <div>
              <FaLaptopCode />
              <span>Collaborative Code Editor</span>
            </div>

            <div>
              <FaRocket />
              <span>Fast & Productive Workspace</span>
            </div>

            <div>
              <FaShieldAlt />
              <span>Secure Authentication</span>
            </div>

          </div>
        </div>

        {/* RIGHT SECTION */}

        <div className="signup-box">

          <div className="signup-header">
            <h1>Create Account</h1>
            <p>Start your collaboration journey</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="signup-field">
              <FaUser />

              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-field">
              <FaUser />

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-field">
              <FaEnvelope />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="signup-field">
              <FaLock />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
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

            <div className="password-strength">
              <div
                className="strength-bar"
                style={{
                  width: `${getStrength()}%`,
                }}
              ></div>
            </div>

            <small className="strength-text">
              Password Strength
            </small>
                        <div className="signup-field">
              <FaLock />

              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <span
                className="password-eye"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="terms">
              <label>
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                />

                <span>
                  I agree to{" "}
                  <a href="#">Terms &amp; Conditions</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="signup-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
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

          <p className="login-text">
            Already have an account?

            <Link to="/login">
              {" "}Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;