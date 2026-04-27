import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { getRooms } from "../services/roomService";

const API = process.env.REACT_APP_API;

function ChatPage({ rooms, activeRoom, setActiveRoom, setRooms, onLogout }) {
  // =========================
  // STATE
  // =========================
  const [showSidebar, setShowSidebar] = useState(true);

  // =========================
  // FETCH ROOMS
  // =========================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        console.log("ROOMS:", data);

        const formatted = {};

        if (Array.isArray(data)) {
          data.forEach((room) => {
            const id = room._id || room.id;

            formatted[id] = {
              ...room,
              messages: [],
              unread: 0,
            };
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
    setActiveRoom(roomId);
    setShowSidebar(false);
  };

  const handleCreateRoom = async () => {
    const name = prompt("Enter room name");
    if (!name) return;

    try {
      const res = await fetch(`${API}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name }),
      });

      const room = await res.json();

      setRooms((prev) => ({
        ...prev,
        [room._id]: {
          name: room.name,
          unread: 0,
          messages: [],
        },
      }));

      setActiveRoom(room._id);
      setShowSidebar(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async () => {
    if (!activeRoom) {
      alert("Select a room first");
      return;
    }

    // 🔥 CHANGE THIS
    const email = prompt(
      `Add user to "${rooms[activeRoom]?.name}"\nEnter user email:`
    );

    if (!email) return;

    try {
      console.log("Adding user to room:", activeRoom);

      await fetch(`${API}/rooms/${activeRoom}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        // 🔥 CHANGE THIS
        body: JSON.stringify({ email }),
      });

      alert("User added");
    } catch (err) {
      console.error(err);
    }
  };
  // =========================
  // DERIVED STATE
  // =========================
  const activeRoomData = rooms[activeRoom];

  // =========================
  // UI
  // =========================
  return (
    <div className={`app ${showSidebar ? "" : "sidebar-hidden"}`}>
      {/* SIDEBAR */}
      <Sidebar
        rooms={rooms}
        activeRoom={activeRoom}
        onRoomSelect={handleRoomSelect}
        onCreateRoom={handleCreateRoom}
      />

      {/* CHAT AREA */}
      <div className="chat">
        {/* HEADER */}
        <div className="chat-header">
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button
              className="menu-btn"
              onClick={() => setShowSidebar((s) => !s)}
            >
              ☰
            </button>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "1.1rem", color: "#e9edef" }}>
                {activeRoomData?.name || "LAN MESSENGER"}
              </span>
            </div>
          </div>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: "12px",
            }}
          >
            {activeRoom && (
              <button
                className="action-btn add-user"
                onClick={handleAddUser}
              >
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
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#222e35",
            }}
          >
            <div style={{ fontSize: "80px", opacity: 0.1 }}>💬</div>

            <h2 style={{ color: "#e9edef", marginTop: "20px" }}>
              No Chat Selected
            </h2>

            <p style={{ color: "#8696a0" }}>
              Send and receive messages in private groups.
            </p>

            <button
              className="action-btn add-user"
              style={{ marginTop: "20px", padding: "10px 25px" }}
              onClick={handleCreateRoom}
            >
              Create New Group
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

export default ChatPage;