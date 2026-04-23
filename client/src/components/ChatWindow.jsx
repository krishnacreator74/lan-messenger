import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { io } from "socket.io-client";

// ✅ Use logged-in user from localStorage
const currentUser = JSON.parse(localStorage.getItem("user"));

function ChatWindow({ room, setRooms, roomId, toggleSidebar }) {
  const socketRef = useRef(null);
  const fileInputRef = useRef(null);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const seekFunctions = useRef({});

  // 🔥 connect socket with auth
  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API, {
      auth: { token: localStorage.getItem("token") },
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // 🔥 join room
  useEffect(() => {
    if (!roomId || !socketRef.current) return;
    socketRef.current.emit("join_room", roomId);
  }, [roomId]);

  // 🔥 receive messages
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("receive_message", (msg) => {
      const formatted = {
        type: msg.type || "text",
        text: msg.text,
        audioUrl: msg.audioUrl,
        sender: {
          id: msg.senderId,
          name: msg.sender,
        },
        timestamp: msg.timestamp || Date.now(),
      };

      setRooms((prev) => {
        if (!msg.roomId) return prev;

        return {
          ...prev,
          [msg.roomId]: {
            ...prev[msg.roomId],
            messages: [
              ...(prev[msg.roomId]?.messages || []),
              formatted,
            ],
          },
        };
      });
    });

    return () => {
      socketRef.current.off("receive_message");
    };
  }, []);

  // 🔥 fetch old messages
  useEffect(() => {
    if (!roomId) return;

    fetch(`${process.env.REACT_APP_API}/messages/${roomId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((msg) => ({
          type: msg.type || "text",
          text: msg.text,
          audioUrl: msg.audioUrl,
          sender: {
            id: msg.senderId,
            name: msg.sender,
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
      })
      .catch((err) => console.error("Fetch messages error:", err));
  }, [roomId]);

  // 🔥 auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room?.messages]);

  // 🔥 send message
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    const msg = {
      roomId,
      senderId: currentUser.id,
      sender: currentUser.name,
      text: input,
      type: "text",
    };

    socketRef.current.emit("send_message", msg);
    setInput("");
  };

  // 🔥 timestamp parser (for audio seeking)
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

              const lastAudioIndex =
                audioIndexes[audioIndexes.length - 1];
              const seekFn = seekFunctions.current[lastAudioIndex];

              if (seekFn) seekFn(totalSeconds);
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
        {room?.name}
      </div>

      <div
        className="messages"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {room?.messages?.map((msg, i) => {
          if (msg.type === "text") {
            return (
              <MessageBubble
                key={i}
                {...msg}
                currentUser={currentUser}
                text={parseTextWithTimestamps(msg.text)}
              />
            );
          }

          return (
            <MessageBubble
              key={i}
              {...msg}
              currentUser={currentUser}
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
            color: "#8696a0",
          }}
        >
          📎
        </button>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("audio", file);

            try {
              const res = await fetch(
                `${process.env.REACT_APP_API}/messages/upload`,
                {
                  method: "POST",
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                  body: formData,
                }
              );

              const data = await res.json();

              socketRef.current.emit("send_message", {
                roomId,
                senderId: currentUser.id,
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
