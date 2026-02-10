import { useState } from "react";
import MessageBubble from "./MessageBubble";

function ChatWindow() {
  // 1️⃣ messages live in state now
  const [messages, setMessages] = useState([
    { text: "Hey, did you review the WAV?", own: false },
    { text: "Yes, issue at 1:23 👀", own: true },
  ]);

  // 2️⃣ input field state
  const [input, setInput] = useState("");

  // 3️⃣ send message handler
  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { text: input, own: true },
    ]);

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat-header">Audio Team</div>

      <div
        className="messages"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            text={msg.text}
            own={msg.own}
          />
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
