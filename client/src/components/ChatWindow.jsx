import MessageBubble from "./MessageBubble";

function ChatWindow() {
  return (
    <div className="chat">
      <div className="chat-header">
        Audio Team
      </div>

      <div className="messages" style={{ display: "flex", flexDirection: "column" }}>
        <MessageBubble text="Hey, did you review the WAV?" />
        <MessageBubble text="Yes, issue at 1:23 👀" own />
      </div>

      <div className="chat-input">
        <input placeholder="Type a message…" />
      </div>
    </div>
  );
}

export default ChatWindow;
