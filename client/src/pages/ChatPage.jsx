import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function ChatPage({ rooms, activeRoom, setActiveRoom, setRooms }) {
  const [showSidebar, setShowSidebar] = useState(true);

    const handleRoomSelect = (roomId) => {
    setRooms((prev) => ({
        ...prev,
        [roomId]: {
        ...prev[roomId],
        unread: 0, // 👈 clear unread
        },
    }));

    setActiveRoom(roomId);
    setShowSidebar(false);
    };


  return (
    <div className={`app ${showSidebar ? "" : "sidebar-hidden"}`}>
      <Sidebar
        rooms={rooms}
        activeRoom={activeRoom}
        onRoomSelect={handleRoomSelect}
      />

      <ChatWindow
        room={rooms[activeRoom]}
        roomId={activeRoom}
        setRooms={setRooms}
        toggleSidebar={() => setShowSidebar((s) => !s)}
      />
    </div>
  );
}

export default ChatPage;
