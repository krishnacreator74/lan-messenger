import { useState } from "react";
import ChatPage from "./pages/ChatPage";
import "./styles/app.css";

function App() {
  const [rooms, setRooms] = useState({
    audio: {
      name: "Audio Team",
      unread: 0,
messages: [
  {
    type: "text",
    text: "Hey, did you review the WAV?",
    sender: { id: "u2", name: "Arjun" },
    timestamp: Date.now(),
  },
  {
    type: "text",
    text: "Yes, issue at 1:23 👀",
    sender: { id: "u1", name: "You" },
    timestamp: Date.now(),
  },
]

    },
    ml: {
      name: "ML Team",
      unread: 2,
      messages: [
        {
          type: "text",
          text: "Training hit 92% accuracy",
          own: false,
          timestamp: Date.now(),
        },
      ],
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
