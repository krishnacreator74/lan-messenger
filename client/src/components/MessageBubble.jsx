import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

function MessageBubble({ type, text, audioUrl, sender, currentUser, onSeek }) {
  const waveformRef = useRef(null);
  const waveSurferInstance = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const senderId = sender?.id || sender?._id;
  const currentUserId = currentUser?.id || currentUser?._id;

  const own = senderId && currentUserId && senderId.toString() === currentUserId.toString();

  const seekTo = (seconds) => {
    if (waveSurferInstance.current) {
      const duration = waveSurferInstance.current.getDuration();
      waveSurferInstance.current.seekTo(seconds / duration);
    }
  };

  useEffect(() => {
    if (type === "audio" && audioUrl && waveformRef.current) {
      waveSurferInstance.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#8696a0",
        progressColor: "#25d366",
        cursorColor: "#ffffff",
        height: 60,
        barWidth: 2,
        responsive: true,
      });

      waveSurferInstance.current.load(audioUrl).catch((err) => {
        if (err && err.name === 'AbortError') return;
        console.error('WaveSurfer load error:', err);
      });

      waveSurferInstance.current.on("ready", () => {
        setDuration(waveSurferInstance.current.getDuration());
      });

      waveSurferInstance.current.on("audioprocess", () => {
        setCurrentTime(waveSurferInstance.current.getCurrentTime());
      });

      waveSurferInstance.current.on("seek", () => {
        setCurrentTime(waveSurferInstance.current.getCurrentTime());
      });

      waveSurferInstance.current.on("finish", () => {
        setIsPlaying(false);
      });

      if (onSeek) {
        onSeek(seekTo);
      }
    }

    return () => {
      if (waveSurferInstance.current) {
        try {
          waveSurferInstance.current.unAll();
          waveSurferInstance.current.destroy();
        } catch (err) {
          console.warn("WaveSurfer destroy error:", err);
        }
        waveSurferInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, audioUrl]);

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

  return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: own ? "flex-end" : "flex-start", // This pulls the bubble to the side
      width: "100%",
      padding: "2px 0"
    }}
  >
    <div
      style={{
        maxWidth: "65%",
        padding: "8px 12px",
        borderRadius: own ? "10px 0px 10px 10px" : "0px 10px 10px 10px", // WhatsApp style corners
        backgroundColor: own ? "#005c4b" : "#202c33",
        color: "#e9edef",
        position: "relative",
        boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)"
      }}
    >
      {/* Sender Name for group chats */}
      {!own && sender?.name && (
        <div style={{ 
          fontSize: "0.75rem", 
          fontWeight: "bold", 
          color: "#25d366", // WhatsApp Green for names
          marginBottom: "4px" 
        }}>
          {sender.name}
        </div>
      )}

      <div style={{ fontSize: "0.95rem", lineHeight: "1.3" }}>
        {type === "text" && text}
      </div>

      {type === "audio" && (
        <div style={{ minWidth: "250px" }}>
           {/* Your WaveSurfer Code here... */}
        </div>
      )}
      
      {/* Optional: Add a timestamp at the bottom right of the bubble */}
      <div style={{ 
        fontSize: "0.65rem", 
        textAlign: "right", 
        opacity: 0.5, 
        marginTop: "4px" 
      }}>
        10:15 AM
      </div>
    </div>
  </div>
);
}

export default MessageBubble;
