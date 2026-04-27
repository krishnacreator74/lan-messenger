import React, { useState } from "react";
import { login, signup } from "../services/authService";

const LoginPage = ({ onAuthSuccess }) => {
  // =========================
  // STATE
  // =========================
  const [isSignup, setIsSignup] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // =========================
  // HANDLERS
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      const res = isSignup
        ? await signup(form)
        : await login(form);

      if (!res.token || !res.user) {
        throw new Error("Invalid auth response");
      }

      // Save auth data
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      // Debug logs
      console.log("TOKEN SAVED:", res.token);
      setTimeout(() => {
        console.log("LOCAL TOKEN:", localStorage.getItem("token"));
      }, 500);

      // Trigger app entry
      onAuthSuccess();
    } catch (err) {
      console.error(err);
      alert("Auth failed");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={{ padding: 20 }}>
      <h2>{isSignup ? "Signup" : "Login"}</h2>

      {/* NAME (Signup only) */}
      {isSignup && (
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />
      )}

      {/* EMAIL */}
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      {/* PASSWORD */}
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />

      {/* SUBMIT */}
      <button onClick={handleSubmit}>
        {isSignup ? "Signup" : "Login"}
      </button>

      {/* TOGGLE MODE */}
      <p
        onClick={() => setIsSignup((prev) => !prev)}
        style={{ cursor: "pointer" }}
      >
        {isSignup ? "Switch to Login" : "Switch to Signup"}
      </p>
    </div>
  );
};

export default LoginPage;