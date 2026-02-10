import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function ChatWindow({ room, setRooms, roomId, toggleSidebar }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    setRooms((prev) => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        messages: [
          ...prev[roomId].messages,
          { text: input, own: true },
        ],
      },
    }));

    setInput("");
  };

  // 🔥 auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room.messages]);

  return (
    <div className="chat">
      <div className="chat-header">
        <button
          onClick={toggleSidebar}
          style={{
            marginRight: "0.5rem",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "1.2rem",
          }}
        >
          ☰
        </button>
        {room.name}
        </div>
      <div
        className="messages"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {room.messages.map((msg, i) => (
          <MessageBubble key={i} {...msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
      </div>
    </div>
  );
}

export default ChatWindow;
