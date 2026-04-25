import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { getRooms } from "../services/roomService";

function ChatPage({ rooms, activeRoom, setActiveRoom, setRooms, onLogout }) {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();

        const formatted = {};
        data.forEach((room) => {
          const id = room._id || room.id; // 🔥 important fix
          formatted[id] = {
            ...room,
            messages: [],
            unread: 0,
          };
        });

        setRooms(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRooms();
  }, [setRooms]);

  const handleRoomSelect = (roomId) => {
    setRooms((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        unread: 0,
      },
    }));

    setActiveRoom(roomId);
    setShowSidebar(false);
  };

  return (
    <div className={`app ${showSidebar ? "" : "sidebar-hidden"}`}>
      
      {/* Logout */}
      <button onClick={onLogout}>Logout</button>

      {/* Sidebar */}
      <Sidebar
        rooms={rooms}
        activeRoom={activeRoom}
        onRoomSelect={handleRoomSelect}
      />

      {/* Chat */}
      {activeRoom && rooms[activeRoom] ? (
        <ChatWindow
          room={rooms[activeRoom]}
          roomId={activeRoom}
          setRooms={setRooms}
          toggleSidebar={() => setShowSidebar((s) => !s)}
        />
      ) : (
        <div style={{ padding: 20 }}>Select a room</div>
      )}
    </div>
  );
}

export default ChatPage;