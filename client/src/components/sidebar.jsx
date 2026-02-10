function Sidebar({ rooms, activeRoom, setActiveRoom }) {
  return (
    <div className="sidebar">
      <h3>LAN Messenger</h3>

      <div style={{ marginTop: "1rem" }}>
        {Object.entries(rooms).map(([id, room]) => (
          <div
            key={id}
            onClick={() => setActiveRoom(id)}
            style={{
              padding: "0.6rem",
              marginBottom: "0.3rem",
              cursor: "pointer",
              borderRadius: "6px",
              backgroundColor:
                activeRoom === id ? "#202c33" : "transparent",
            }}
          >
            {room.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
