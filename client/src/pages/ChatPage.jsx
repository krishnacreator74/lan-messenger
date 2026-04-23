import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { getRooms } from "../services/roomService";

function ChatPage({ rooms, activeRoom, setActiveRoom, setRooms }) {
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();

        // convert array → object
        const formatted = {};
        data.forEach((room) => {
          formatted[room.id] = {
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
        unread: 0, // clear unread
      },
    }));

    setActiveRoom(roomId);
    setShowSidebar(false);
  };

  return (
    <div className={`app ${showSidebar ? "" : "sidebar-hidden"}`}>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Logout
      </button>

      {/* Sidebar */}
      <Sidebar
        rooms={rooms}
        activeRoom={activeRoom}
        onRoomSelect={handleRoomSelect}
      />

      {/* Right Panel */}
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
