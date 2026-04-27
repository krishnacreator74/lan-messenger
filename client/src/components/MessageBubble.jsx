import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

function MessageBubble({ type, text, audioUrl, sender, currentUser, onSeek, timestamp }) {
  const waveformRef = useRef(null);
  const waveSurferInstance = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // =========================
  // USER RESOLUTION (The Fix)
  // =========================
  // Use .toString() and optional chaining to prevent crashes
  const senderId = String(sender?.id || sender?._id || "").trim();
  const currentUserId = String(currentUser?.id || currentUser?._id || "").trim();
  
  // Comparison needs to be robust: handle nulls and string vs number
  const own = senderId !== "" && currentUserId !== "" && senderId === currentUserId;
  // =========================
  // SEEK FUNCTION
  // =========================
  const seekTo = (seconds) => {
    if (!waveSurferInstance.current) return;
    const totalDuration = waveSurferInstance.current.getDuration();
    if (totalDuration > 0) {
      waveSurferInstance.current.seekTo(seconds / totalDuration);
    }
  };

  // =========================
  // WAVESURFER INIT
  // =========================
  useEffect(() => {
    if (type !== "audio" || !audioUrl || !waveformRef.current) return;

    // Destroy existing instance if it exists before creating a new one
    if (waveSurferInstance.current) {
        waveSurferInstance.current.destroy();
    }

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: own ? "#93b5ae" : "#8696a0", // Subtle color difference for own audio
      progressColor: "#25d366",
      cursorColor: "#ffffff",
      height: 45, // Slimmer height fits chat better
      barWidth: 2,
      gap: 1,
      responsive: true,
      cursorWidth: 1,
    });

    waveSurferInstance.current = ws;

    ws.load(audioUrl).catch(err => console.error("WaveSurfer Error:", err));

    ws.on("ready", () => setDuration(ws.getDuration()));
    ws.on("audioprocess", () => setCurrentTime(ws.getCurrentTime()));
    ws.on("seek", () => setCurrentTime(ws.getCurrentTime()));
    ws.on("finish", () => setIsPlaying(false));

    if (onSeek) onSeek(seekTo);

    return () => {
      ws.destroy();
      waveSurferInstance.current = null;
    };
  }, [audioUrl, type, own]); // Re-run if audioUrl changes

  const togglePlay = () => {
    if (!waveSurferInstance.current) return;
    waveSurferInstance.current.playPause();
    setIsPlaying(waveSurferInstance.current.isPlaying());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Convert timestamp to readable time
  const displayTime = timestamp 
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: own ? "flex-end" : "flex-start",
        width: "100%",
        padding: "4px 10px", // Better spacing
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          maxWidth: "75%", // Standard WhatsApp style width
          padding: "8px 12px",
          borderRadius: own ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
          backgroundColor: own ? "#005c4b" : "#202c33",
          color: "#e9edef",
          position: "relative",
          boxShadow: "0 1px 1px rgba(0,0,0,0.2)",
        }}
      >
        {/* Sender name for others in group */}
        {!own && sender?.name && (
          <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "#25d366", marginBottom: "4px" }}>
            {sender.name}
          </div>
        )}

        {/* CONTENT */}
        {type === "text" ? (
          <div style={{ fontSize: "0.95rem", lineHeight: "1.4", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {text}
          </div>
        ) : (
          <div style={{ minWidth: "220px" }}>
            <div ref={waveformRef} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
              <button 
                onClick={togglePlay}
                style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "1rem" }}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER: Time and Read Receipt Space */}
        <div style={{ fontSize: "0.65rem", textAlign: "right", opacity: 0.5, marginTop: "4px" }}>
          {displayTime}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;