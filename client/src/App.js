import { useState } from "react";
import ChatPage from "./pages/ChatPage";
import "./styles/app.css";

function App() {
  const [rooms, setRooms] = useState({
    audio: {
      name: "Audio Team",
      unread: 0,
      messages: [
        { text: "Hey, did you review the WAV?", own: false },
        { text: "Yes, issue at 1:23 👀", own: true },
      ],
    },
    ml: {
      name: "ML Team",
      unread: 2,
      messages: [{ text: "Training hit 92% accuracy", own: false }],
    },
    general: {
      name: "General",
      unread: 0,
      messages: [],
    },
  });


  const [activeRoom, setActiveRoom] = useState("audio");

  return (
    <ChatPage
      rooms={rooms}
      activeRoom={activeRoom}
      setActiveRoom={setActiveRoom}
      setRooms={setRooms}
    />
  );
}

export default App;
