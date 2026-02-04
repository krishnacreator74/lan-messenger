function MessageBubble({ text, own }) {
  return (
    <div
      style={{
        maxWidth: "60%",
        marginBottom: "0.5rem",
        padding: "0.6rem 0.8rem",
        borderRadius: "8px",
        backgroundColor: own ? "#005c4b" : "#202c33",
        alignSelf: own ? "flex-end" : "flex-start"
      }}
    >
      {text}
    </div>
  );
}

export default MessageBubble;
