import React, { useState } from "react";
import { login, signup } from "../services/authService";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = isSignup
        ? await signup(form)
        : await login(form);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Auth failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{isSignup ? "Signup" : "Login"}</h2>

      {isSignup && (
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
        />
      )}

      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button onClick={handleSubmit}>
        {isSignup ? "Signup" : "Login"}
      </button>

      <p onClick={() => setIsSignup(!isSignup)} style={{ cursor: "pointer" }}>
        {isSignup ? "Switch to Login" : "Switch to Signup"}
      </p>
    </div>
  );
};

export default LoginPage;
