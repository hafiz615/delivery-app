import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signup as signupAPI } from "../utils/api";
import "./SignUp.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🟢 Signup attempt started...");
    console.log("Email:", email);

    if (!validateForm()) {
      console.log("❌ Form validation failed:", errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log("📡 Calling signup API...");
      const data = await signupAPI(email, password, confirmPassword);
      console.log("✅ Signup API Response:", data);

      if (!data?.token) {
        throw new Error("Invalid response: token missing");
      }

      // Auto-login after successful signup
      login(data.token, data.user);
      console.log("✅ Signup successful, navigating to /delivery");
      navigate("/delivery");
    } catch (err) {
      console.error("❌ Signup error:", err);

      if (err.response) {
        console.error("Backend error:", err.response.data);
        setErrors({
          submit:
            err.response.data.error ||
            err.response.data.message ||
            "Signup failed",
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
      console.log("🏁 Signup attempt finished");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>

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
            placeholder="you@example.com"
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
            placeholder="At least 6 characters"
            disabled={loading}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }
            }}
            placeholder="Re-enter your password"
            disabled={loading}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        {errors.submit && (
          <div className="error-banner">
            <p className="error">{errors.submit}</p>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="auth-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;
