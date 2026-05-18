import React, { useState } from "react";
import { login, signup } from "../services/authService";

const LoginPage = ({ onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (isSignup && !form.name) {
      setError("Please enter your name.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const res = isSignup ? await signup(form) : await login(form);
      if (!res.token || !res.user) throw new Error("Invalid auth response");
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      onAuthSuccess();
    } catch (err) {
      console.error(err);
      setError(isSignup ? "Signup failed. Try a different email." : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={styles.page}>
      {/* Background doodle overlay */}
      <div style={styles.bgOverlay} />

      <div style={styles.card}>
        {/* Logo / Brand */}
        <div style={styles.brand}>
          <div style={styles.logoCircle}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h1 style={styles.brandName}>LAN Messenger</h1>
          <p style={styles.brandSub}>Secure local network messaging</p>
        </div>

        {/* Tab switcher */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(isSignup ? {} : styles.tabActive) }}
            onClick={() => { setIsSignup(false); setError(""); }}
          >
            Log In
          </button>
          <button
            style={{ ...styles.tab, ...(isSignup ? styles.tabActive : {}) }}
            onClick={() => { setIsSignup(true); setError(""); }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div style={styles.form}>
          {isSignup && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Name</label>
              <input
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                style={styles.input}
                autoComplete="name"
              />
            </div>
          )}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              style={styles.input}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </div>

          {/* Error message */}
          {error && (
            <div style={styles.errorBanner}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnDisabled : {}) }}
          >
            {loading ? (
              <span style={styles.spinner} />
            ) : (
              isSignup ? "Create Account" : "Log In"
            )}
          </button>
        </div>

        <p style={styles.switchText}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            onClick={() => { setIsSignup((p) => !p); setError(""); }}
            style={styles.switchLink}
          >
            {isSignup ? "Log in" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    backgroundColor: "#0b141a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  bgOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: "url('../img/doodle.png')",
    backgroundSize: "400px",
    opacity: 0.03,
    pointerEvents: "none",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#111b21",
    borderRadius: "16px",
    border: "1px solid rgba(134,150,160,0.15)",
    padding: "36px 32px 28px",
    position: "relative",
    zIndex: 1,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  brand: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "28px",
    gap: "8px",
  },
  logoCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    backgroundColor: "#00a884",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  brandName: {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#e9edef",
    letterSpacing: "-0.3px",
  },
  brandSub: {
    fontSize: "0.8rem",
    color: "#8696a0",
  },
  tabs: {
    display: "flex",
    backgroundColor: "#202c33",
    borderRadius: "8px",
    padding: "3px",
    marginBottom: "24px",
  },
  tab: {
    flex: 1,
    padding: "8px",
    border: "none",
    borderRadius: "6px",
    background: "transparent",
    color: "#8696a0",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    backgroundColor: "#2a3942",
    color: "#e9edef",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#8696a0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    height: "44px",
    padding: "0 14px",
    backgroundColor: "#202c33",
    border: "1px solid rgba(134,150,160,0.2)",
    borderRadius: "8px",
    color: "#e9edef",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    backgroundColor: "rgba(241,92,92,0.12)",
    border: "1px solid rgba(241,92,92,0.3)",
    borderRadius: "8px",
    color: "#f15c5c",
    fontSize: "0.85rem",
  },
  submitBtn: {
    height: "46px",
    marginTop: "4px",
    backgroundColor: "#00a884",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background-color 0.2s, transform 0.1s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#005c4b",
    cursor: "not-allowed",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  switchText: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#8696a0",
  },
  switchLink: {
    color: "#00a884",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default LoginPage;
