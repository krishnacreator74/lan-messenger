function Sidebar({ rooms, activeRoom, onRoomSelect }) {
  return (
    <div className="sidebar">
      {/* HEADER */}
      <h3>LAN Messenger</h3>

      {/* ROOM LIST */}
      <div style={{ marginTop: "1rem" }}>
        {Object.entries(rooms).map(([id, room]) => {
          const isActive = activeRoom === id;

          return (
            <div
              key={id}
              onClick={() => onRoomSelect(id)}
              style={{
                padding: "0.6rem",
                marginBottom: "0.3rem",
                cursor: "pointer",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: isActive ? "#202c33" : "transparent",
              }}
            >
              {/* ROOM NAME */}
              <span>{room.name}</span>

              {/* UNREAD BADGE */}
              {room.unread > 0 && (
                <span
                  style={{
                    background: "#25d366",
                    color: "#000",
                    borderRadius: "999px",
                    padding: "0 6px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }}
                >
                  {room.unread}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;