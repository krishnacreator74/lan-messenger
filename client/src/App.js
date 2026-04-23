import React, { useState, useEffect } from "react";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) setLoggedIn(true);
  }, []);

  return loggedIn ? (
    <ChatPage onLogout={() => setLoggedIn(false)} />
  ) : (
    <LoginPage onAuthSuccess={() => setLoggedIn(true)} />
  );
}

export default App;
