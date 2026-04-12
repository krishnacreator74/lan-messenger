import React, { useState, useEffect } from "react";
import ChatPage from "./pages/ChatPage";
import "./styles/app.css";

function App() {
  const [rooms, setRooms] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/rooms")
      .then(res => res.json())
      .then(data => {
        const formattedRooms = {};

        data.forEach(room => {
          formattedRooms[room._id || room.id] = {
            name: room.name,
            unread: 0,
            messages: []
          };
        });

        setRooms(formattedRooms);
        setActiveRoom(data[0]?._id || data[0]?.id);
      })
      .catch(err => console.error("Error fetching rooms:", err));
  }, []);

  // 🔥 WAIT until data is ready
  if (!activeRoom || !rooms[activeRoom]) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  // 🔥 MAIN APP
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