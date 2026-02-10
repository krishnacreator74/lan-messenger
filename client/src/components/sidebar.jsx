function Sidebar({ rooms, activeRoom, onRoomSelect }) {
  return (
    <div className="sidebar">
      <h3>LAN Messenger</h3>

      <div style={{ marginTop: "1rem" }}>
        {Object.entries(rooms).map(([id, room]) => (
          <div
            key={id}
            onClick={() => onRoomSelect(id)}
            style={{
              padding: "0.6rem",
              marginBottom: "0.3rem",
              cursor: "pointer",
              borderRadius: "6px",
              backgroundColor:
                activeRoom === id ? "#202c33" : "transparent",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{room.name}</span>

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
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
