import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./styles/app.css";

function App() {
  const [rooms, setRooms] = useState({
    audio: {
      name: "Audio Team",
      messages: [
        { text: "Hey, did you review the WAV?", own: false },
        { text: "Yes, issue at 1:23 👀", own: true },
      ],
    },
    ml: {
      name: "ML Team",
      messages: [
        { text: "Training hit 92% accuracy", own: false },
      ],
    },
    general: {
      name: "General",
      messages: [],
    },
  });

  const [activeRoom, setActiveRoom] = useState("audio");

  return (
    <div className="app">
      <Sidebar
        rooms={rooms}
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
      />
      <ChatWindow
        room={rooms[activeRoom]}
        setRooms={setRooms}
        roomId={activeRoom}
      />
    </div>
  );
}

export default App;
