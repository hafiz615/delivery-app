import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginAPI } from "../utils/api";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Login attempt started...");
    console.log("Email:", email);
    console.log("Password length:", password.length);

    if (!validateForm()) {
      console.log("❌ Form validation failed:", errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log("📡 Calling API...");
      const data = await loginAPI(email, password);
      console.log("✅ API Response:", data);

      if (!data?.token) {
        throw new Error("Invalid response: token missing");
      }

      login(data.token, data.user);

      navigate("/delivery");
    } catch (err) {
      console.error("❌ Login error:", err);

      if (err.response) {
        console.error("Backend error:", err.response.data);
        setErrors({
          submit:
            err.response.data.error ||
            err.response.data.message ||
            "Login failed",
        });
      } else if (err.request) {
        console.error("No response from server:", err.request);
        setErrors({
          submit:
            "Cannot connect to server. Please check if the backend is running.",
        });
      } else if (err.message) {
        console.error("Error message:", err.message);
        setErrors({ submit: err.message });
      } else {
        console.error("Unknown error:", err);
        setErrors({
          submit: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
      console.log("🏁 Login attempt finished");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: "" }));
              }
            }}
            placeholder="test@example.com"
            disabled={loading}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: "" }));
              }
            }}
            placeholder="password123"
            disabled={loading}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {errors.submit && (
          <div className="error-banner">
            <p className="error">{errors.submit}</p>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="demo-note">
        Demo credentials: <strong>test@example.com</strong> /{" "}
        <strong>password123</strong>
      </p>

      <p className="auth-link">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
