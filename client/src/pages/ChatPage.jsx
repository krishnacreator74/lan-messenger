import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import CreateGroupModal from "../components/CreateGroupModal";
import { getRooms } from "../services/roomService";

const API = process.env.REACT_APP_API;

function ChatPage({ rooms, activeRoom, setActiveRoom, setRooms, onLogout }) {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // =========================
  // FETCH ROOMS
  // =========================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        const formatted = {};
        if (Array.isArray(data)) {
          data.forEach((room) => {
            const id = room._id || room.id;
            formatted[id] = { ...room, messages: [], unread: 0 };
          });
        }
        setRooms(formatted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, [setRooms]);

  // =========================
  // HANDLERS
  // =========================
  const handleRoomSelect = (roomId) => {
    if (roomId === null) {
      setActiveRoom(null);
      setShowSidebar(true);
    } else {
      setActiveRoom(roomId);
      setShowSidebar(false);
    }
  };

  // Called by CreateGroupModal with the validated name
  const handleCreateRoom = async (name) => {
    const res = await fetch(`${API}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error("Failed to create room");

    const room = await res.json();

    setRooms((prev) => ({
      ...prev,
      [room._id]: { name: room.name, unread: 0, messages: [] },
    }));

    setActiveRoom(room._id);
    setShowSidebar(false);
  };

  const handleAddUser = async () => {
    if (!activeRoom) {
      alert("Select a room first");
      return;
    }
    const email = prompt(`Add user to "${rooms[activeRoom]?.name}"\nEnter user email:`);
    if (!email) return;
    try {
      await fetch(`${API}/rooms/${activeRoom}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email }),
      });
      alert("User added");
    } catch (err) {
      console.error(err);
    }
  };

  const activeRoomData = rooms[activeRoom];

  // =========================
  // UI
  // =========================
  return (
    <div className={`app ${showSidebar ? "" : "sidebar-hidden"}`}>
      {/* CREATE GROUP MODAL */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateRoom}
      />

      {/* SIDEBAR */}
      <Sidebar
        rooms={rooms}
        activeRoom={activeRoom}
        onRoomSelect={handleRoomSelect}
        onCreateRoom={() => setShowCreateModal(true)}
      />

      {/* CHAT AREA */}
      <div className="chat">
        {/* HEADER */}
        <div className="chat-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="menu-btn"
              onClick={() => setShowSidebar((s) => !s)}
              style={headerBtnStyle}
              title="Toggle sidebar"
            >
              ☰
            </button>

            {activeRoomData ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={roomAvatarStyle}>
                  {(activeRoomData.name || "?")
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "1rem", fontWeight: "700", color: "#e9edef" }}>
                    {activeRoomData.name}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#8696a0" }}>Group</span>
                </div>
              </div>
            ) : (
              <span style={{ fontSize: "1rem", fontWeight: "700", color: "#e9edef" }}>
                LAN Messenger
              </span>
            )}
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
            {activeRoom && (
              <button className="action-btn add-user" onClick={handleAddUser}>
                + Add Member
              </button>
            )}
            <button className="action-btn logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* EMPTY STATE */}
        {!activeRoom ? (
          <div style={emptyStateStyle}>
            <div style={{ fontSize: "72px", opacity: 0.08, lineHeight: 1 }}>💬</div>
            <h2 style={{ color: "#e9edef", marginTop: "16px", fontSize: "1.3rem", fontWeight: "700" }}>
              No chat selected
            </h2>
            <p style={{ color: "#8696a0", fontSize: "0.9rem", maxWidth: "260px", textAlign: "center", lineHeight: "1.5" }}>
              Pick a group from the sidebar or create a new one.
            </p>
            <button
              className="action-btn add-user"
              style={{ marginTop: "20px", padding: "10px 24px" }}
              onClick={() => setShowCreateModal(true)}
            >
              + New Group
            </button>
          </div>
        ) : (
          <ChatWindow
            room={activeRoomData}
            roomId={activeRoom}
            setRooms={setRooms}
            toggleSidebar={() => setShowSidebar((s) => !s)}
            onLogout={onLogout}
            onAddUser={handleAddUser}
          />
        )}
      </div>
    </div>
  );
}

const headerBtnStyle = {
  background: "rgba(134,150,160,0.1)",
  border: "none",
  color: "#aebac1",
  width: "36px",
  height: "36px",
  borderRadius: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  transition: "background-color 0.2s",
  flexShrink: 0,
};

const roomAvatarStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  backgroundColor: "#005c4b",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.75rem",
  fontWeight: "700",
  color: "#e9edef",
  flexShrink: 0,
};

const emptyStateStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#0b141a",
  gap: "8px",
};

export default ChatPage;