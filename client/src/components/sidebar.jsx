function Sidebar({ rooms, activeRoom, onRoomSelect, onCreateRoom }) {
  // Click active room again → deselects it (passes null)
  const handleRoomClick = (id) => {
    if (id === activeRoom) {
      onRoomSelect(null);
    } else {
      onRoomSelect(id);
    }
  };

  const roomEntries = Object.entries(rooms);

  return (
    <div className="sidebar">
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.avatar}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span style={styles.headerTitle}>LAN Messenger</span>
        </div>
      </div>

      {/* NEW GROUP BUTTON */}
      <div style={styles.newGroupWrapper}>
        <button onClick={onCreateRoom} style={styles.newGroupBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Group
        </button>
      </div>

      {/* SECTION LABEL */}
      <div style={styles.sectionLabel}>GROUPS</div>

      {/* ROOM LIST */}
      <div style={styles.roomList}>
        {roomEntries.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <p style={styles.emptyText}>No groups yet</p>
            <p style={styles.emptySubText}>Create one to get started</p>
          </div>
        ) : (
          roomEntries.map(([id, room]) => {
            const isActive = activeRoom === id;
            const initials = (room.name || "?")
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={id}
                onClick={() => handleRoomClick(id)}
                style={{
                  ...styles.roomItem,
                  ...(isActive ? styles.roomItemActive : {}),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "#202c33";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    ...styles.roomAvatar,
                    backgroundColor: isActive ? "#005c4b" : "#2a3942",
                  }}
                >
                  {initials}
                </div>

                {/* Room info */}
                <div style={styles.roomInfo}>
                  <span style={styles.roomName}>{room.name}</span>
                  {room.lastMessage && (
                    <span style={styles.roomPreview}>{room.lastMessage}</span>
                  )}
                </div>

                {/* Unread badge */}
                {room.unread > 0 && (
                  <span style={styles.badge}>{room.unread}</span>
                )}

                {/* Active indicator */}
                {isActive && <div style={styles.activeBar} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    height: "60px",
    minHeight: "60px",
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#202c33",
    borderBottom: "1px solid rgba(134,150,160,0.12)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#00a884",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#e9edef",
    letterSpacing: "-0.2px",
  },
  newGroupWrapper: {
    padding: "12px 12px 8px",
  },
  newGroupBtn: {
    width: "100%",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    backgroundColor: "rgba(0,168,132,0.12)",
    color: "#00a884",
    border: "1px solid rgba(0,168,132,0.3)",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontFamily: "inherit",
  },
  sectionLabel: {
    padding: "4px 16px 6px",
    fontSize: "0.7rem",
    fontWeight: "700",
    color: "#8696a0",
    letterSpacing: "0.8px",
  },
  roomList: {
    flex: 1,
    overflowY: "auto",
  },
  roomItem: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    cursor: "pointer",
    backgroundColor: "transparent",
    transition: "background-color 0.15s",
    borderBottom: "1px solid rgba(134,150,160,0.06)",
    userSelect: "none",
  },
  roomItemActive: {
    backgroundColor: "#2a3942",
  },
  roomAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#e9edef",
    flexShrink: 0,
    transition: "background-color 0.2s",
  },
  roomInfo: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  roomName: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#e9edef",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  roomPreview: {
    fontSize: "0.8rem",
    color: "#8696a0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  badge: {
    backgroundColor: "#00a884",
    color: "#000",
    borderRadius: "999px",
    padding: "2px 7px",
    fontSize: "0.72rem",
    fontWeight: "700",
    flexShrink: 0,
    minWidth: "20px",
    textAlign: "center",
  },
  activeBar: {
    position: "absolute",
    left: 0,
    top: "20%",
    height: "60%",
    width: "3px",
    backgroundColor: "#00a884",
    borderRadius: "0 2px 2px 0",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    gap: "8px",
  },
  emptyIcon: {
    marginBottom: "8px",
    opacity: 0.5,
  },
  emptyText: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#8696a0",
  },
  emptySubText: {
    fontSize: "0.8rem",
    color: "#8696a0",
    opacity: 0.7,
  },
};

export default Sidebar;
