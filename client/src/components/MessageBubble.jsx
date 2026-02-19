function MessageBubble({ type, text, audioUrl, own }) {
  return (
    <div
      style={{
        maxWidth: "60%",
        marginBottom: "0.5rem",
        padding: "0.6rem 0.8rem",
        borderRadius: "8px",
        backgroundColor: own ? "#005c4b" : "#202c33",
        alignSelf: own ? "flex-end" : "flex-start",
      }}
    >
      {type === "text" && text}

      {type === "audio" && audioUrl && (
        <audio controls src={audioUrl} style={{ width: "300px", minWidth: "500px", display: "block" }} />
      )}
    </div>
  );
}

export default MessageBubble;
