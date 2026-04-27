import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import MessageBubble from "./MessageBubble";

function ChatWindow({ room, setRooms, roomId, toggleSidebar }) {
  // =========================
  // USER INIT
  // =========================
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Invalid user in localStorage");
    }
  }, []);

  const socketRef = useRef(null);
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);
  const seekFunctions = useRef({});
  const [input, setInput] = useState("");

  // =========================
  // SOCKET CONNECTION
  // =========================
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API, {
      auth: { token: localStorage.getItem("token") },
    });

    const handleReceiveMessage = (msg) => {
      if (!msg.roomId) return;
      
      const formatted = {
        type: msg.type || "text",
        text: msg.text,
        audioUrl: msg.audioUrl,
        sender: {
          id: String(msg.senderId),
          name: msg.sender,
        },
        timestamp: msg.timestamp || Date.now(),
      };

      setRooms((prev) => ({
        ...prev,
        [msg.roomId]: {
          ...(prev[msg.roomId] || {}),
          messages: [...(prev[msg.roomId]?.messages || []), formatted],
        },
      }));
    };

    socketRef.current.on("receiveMessage", handleReceiveMessage);

    return () => {
      socketRef.current.off("receiveMessage");
      socketRef.current.disconnect();
    };
  }, [setRooms]);

  // =========================
  // JOIN ROOM & FETCH OLD MESSAGES
  // =========================
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.REACT_APP_API}/messages/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const formatted = data.map((msg) => ({
          type: msg.type || "text",
          text: msg.text,
          audioUrl: msg.audioUrl,
          sender: {
            id: String(msg.senderId || msg.sender?._id || ""),
            name: msg.senderName || msg.sender || "Unknown",
          },
          timestamp: msg.timestamp,
        }));


        setRooms((prev) => ({
          ...prev,
          [roomId]: {
            ...prev[roomId],
            messages: formatted,
          },
        }));
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchMessages();
  }, [roomId, setRooms]); 

  // =========================
  // AUTO SCROLL
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [room?.messages]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = async () => {
    if (!input.trim() || !roomId) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ roomId, text: input }),
      });

      const savedMsg = await res.json();

      socketRef.current.emit("sendMessage", {
        roomId,
        senderId: currentUser.id || currentUser._id,
        sender: currentUser.name,
        text: savedMsg.text,
        type: "text",
      });

      setInput("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const parseTextWithTimestamps = (text) => {
    if (!text || typeof text !== "string") return text;

    return text.split(/(\d+:\d+)/g).map((part, index) => {
      const match = part.match(/^(\d+):(\d+)$/);
      if (!match) return part;

      const totalSeconds = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);

      return (
        <span
          key={index}
          className="timestamp-link"
          style={{ color: "#25d366", cursor: "pointer", fontWeight: "bold" }}
          onClick={() => {
            const audioIndexes = Object.keys(seekFunctions.current);
            if (!audioIndexes.length) return;
            const lastAudioIndex = audioIndexes[audioIndexes.length - 1];
            const seekFn = seekFunctions.current[lastAudioIndex];
            if (seekFn) seekFn(totalSeconds);
          }}
        >
          {part}
        </span>
      );
    });
  };

  if (!roomId) {
    return (
      <div className="chat-placeholder" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%', 
        backgroundColor: '#222e35', 
        color: '#8696a0',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '20px' }}>💬</div>
        <h2 style={{ color: '#e9edef' }}>LAN Messenger</h2>
        <p style={{ maxWidth: '300px' }}>Select a contact or group to start chatting.</p>
        
        {/* You can add your "Create Group" button here if you like */}
        <button 
           onClick={toggleSidebar} // Assuming toggleSidebar opens your menu
           style={{
             marginTop: '20px',
             padding: '10px 20px',
             backgroundColor: '#00a884',
             color: 'white',
             border: 'none',
             borderRadius: '24px',
             cursor: 'pointer',
             fontWeight: 'bold'
           }}
        >
          Open Sidebar to Start
        </button>
      </div>
    );
  }
return (
    <div className="chat" key={roomId}> {/* key={roomId} forces refresh on change */}
      <div className="messages" style={{ overflowY: "auto", height: "80vh" }}>
        {/* 3. Improved Loading check */}
        {!room?.messages ? (
          <div className="loading" style={{ color: "#8696a0", textAlign: "center", marginTop: "20px" }}>
            Loading messages...
          </div>
        ) : (
          room.messages.map((msg, i) => (
            <MessageBubble
              key={`${roomId}-${i}`} 
              {...msg}
              currentUser={currentUser}
              onSeek={(seekFn) => {
                if (msg.type === "audio") {
                  seekFunctions.current[i] = seekFn;
                }
              }}
              text={
                msg.type === "text"
                  ? parseTextWithTimestamps(msg.text)
                  : msg.text
              }
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <button onClick={() => fileInputRef.current.click()} className="attach-btn">
          📎
        </button>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file || !currentUser) return;

            const formData = new FormData();
            formData.append("audio", file);
            formData.append("roomId", roomId);

            try {
              const res = await fetch(`${process.env.REACT_APP_API}/messages/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: formData,
              });
              const data = await res.json();

              socketRef.current.emit("sendMessage", {
                roomId,
                senderId: currentUser.id || currentUser._id,
                sender: currentUser.name,
                type: "audio",
                audioUrl: data.url,
              });
            } catch (err) {
              console.error("Upload failed:", err);
            }
          }}
        />

        <input
          placeholder="Type a message…"
          className="main-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
      </div>
    </div>
  );
}

export default ChatWindow;