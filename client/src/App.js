import React, { useState } from "react";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import "./styles/app.css";

function App() {
  const [rooms, setRooms] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  if (!loggedIn) {
    return <LoginPage onAuthSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <ChatPage
      rooms={rooms}
      activeRoom={activeRoom}
      setActiveRoom={setActiveRoom}
      setRooms={setRooms}
      onLogout={() => {
        localStorage.clear();
        setLoggedIn(false);
      }}
    />
  );
}

export default App;