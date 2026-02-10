import { useState } from "react";
import MessageBubble from "./MessageBubble";

function ChatWindow({ room, setRooms, roomId }) {
  const [input, setInput] = useState("");

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

  return (
    <div className="chat">
      <div className="chat-header">{room.name}</div>

      <div
        className="messages"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {room.messages.map((msg, i) => (
          <MessageBubble key={i} {...msg} />
        ))}
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
