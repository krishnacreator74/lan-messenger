import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

function MessageBubble({ type, text, audioUrl, own }) {
  const waveformRef = useRef(null);
  const waveSurferInstance = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

      waveSurferInstance.current.load(audioUrl);

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
    }

    return () => {
      waveSurferInstance.current?.destroy();
    };
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
        maxWidth: "60%",
        marginBottom: "0.8rem",
        padding: "0.8rem",
        borderRadius: "10px",
        backgroundColor: own ? "#005c4b" : "#202c33",
        alignSelf: own ? "flex-end" : "flex-start",
      }}
    >
      {type === "text" && text}

      {type === "audio" && (
        <>
          <div
            ref={waveformRef}
            style={{ width: "400px", maxWidth: "100%" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "6px",
              fontSize: "0.85rem",
              opacity: 0.8,
            }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <button
            onClick={togglePlay}
            style={{
              marginTop: "6px",
              background: "none",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
        </>
      )}
    </div>
  );
}

export default MessageBubble;
