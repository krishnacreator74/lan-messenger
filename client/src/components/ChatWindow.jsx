import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function ChatWindow({ room, setRooms, roomId, toggleSidebar }) {
  const fileInputRef = useRef(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    setRooms((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((id) => {
        if (id === roomId) {
          updated[id] = {
            ...updated[id],
            messages: [
              ...updated[id].messages,
              { type: "text", text: input, own: true, timestamp: Date.now() },
            ],
          };
        } else {
          updated[id] = {
            ...updated[id],
            unread: updated[id].unread + 1, // 👈 simulate incoming
          };
        }
      });

      return updated;
    });

    setInput("");
  };


  // 🔥 auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room.messages]);

  const seekFunctions = useRef({});

  const parseTextWithTimestamps = (text) => {
    return text.split(/(\d+:\d+)/g).map((part, index) => {
      const match = part.match(/^(\d+):(\d+)$/);

      if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseInt(match[2], 10);
        const totalSeconds = minutes * 60 + seconds;

        return (
          <span
            key={index}
            style={{
              color: "#25d366",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => {
              const audioIndexes = Object.keys(seekFunctions.current);
              if (!audioIndexes.length) return;

              const lastAudioIndex = audioIndexes[audioIndexes.length - 1];
              const seekFn = seekFunctions.current[lastAudioIndex];

              if (seekFn) {
                seekFn(totalSeconds);
              }
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

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
        {room.messages.map((msg, i) => {
          if (msg.type === "text") {
            return (
              <MessageBubble
                key={i}
                {...msg}
                text={parseTextWithTimestamps(msg.text)}
              />
            );
          }
          return (
            <MessageBubble
              key={i}
              {...msg}
              onSeek={(fn) => {
                seekFunctions.current[i] = fn;
              }}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.5rem",
            marginRight: "10px",
            color: "#8696a0"
          }}
        >
          📎
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            const audioUrl = URL.createObjectURL(file);
            console.log("Audio URL:", audioUrl);
            setRooms((prev) => ({
              ...prev,
              [roomId]: {
                ...prev[roomId],
                messages: [
                  ...prev[roomId].messages,
                  {
                    type: "audio",
                    audioUrl,
                    own: true,
                    timestamp: Date.now(),
                  },
                ],
              },
            }));
            e.target.value = null;
          }}
          
        />

        <input
          placeholder="Type a message…"
          style={{ flex: 1, fontSize: "1.1rem", padding: "10px" }}
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
