import { useState, useEffect } from "react";
import ChatPage from "./pages/ChatPage";
import "./styles/app.css";

function App() {

  const [rooms, setRooms] = useState({});
  const [activeRoom, setActiveRoom] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/rooms")
      .then(res => res.json())
      .then(data => {
        // convert array into object structure frontend expects
        const formattedRooms = {};

        data.forEach(room => {
          formattedRooms[room.id] = {
            name: room.name,
            unread: 0,
            messages: [] // start empty for now
          };
        });

        setRooms(formattedRooms);
        setActiveRoom(data[0]?.id);
      })
      .catch(err => console.error("Error fetching rooms:", err));
  }, []);

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
