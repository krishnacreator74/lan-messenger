import React, { useState } from "react";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import "./styles/app.css";

function App() {
  // =========================
  // STATE
  // =========================
  const [rooms, setRooms] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  // =========================
  // HANDLERS
  // =========================
  const handleAuthSuccess = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setRooms({});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
  };

  // =========================
  // ROUTING LOGIC
  // =========================
  if (!loggedIn) {
    return <LoginPage onAuthSuccess={handleAuthSuccess} />;
  }

  // =========================
  // MAIN APP
  // =========================
  return (
    <ChatPage
      rooms={rooms}
      activeRoom={activeRoom}
      setActiveRoom={setActiveRoom}
      setRooms={setRooms}
      onLogout={handleLogout}
    />
  );
}

export default App;