import { useState, useEffect, useRef } from "react";

function CreateGroupModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setError("");
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Group name can't be empty.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onCreate(trimmed);
      onClose();
    } catch (err) {
      setError("Failed to create group. Try again.");
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    // Backdrop
    <div style={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <h2 style={styles.title}>New Group</h2>
            <p style={styles.subtitle}>Give your group a name to get started</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <label style={styles.label}>Group Name</label>
          <input
            ref={inputRef}
            type="text"
            placeholder="e.g. Team Alpha, Project X…"
            value={name}
            onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
            onKeyDown={handleKeyDown}
            maxLength={50}
            style={{
              ...styles.input,
              ...(error ? styles.inputError : {}),
            }}
          />
          <div style={styles.inputMeta}>
            {error ? (
              <span style={styles.errorText}>{error}</span>
            ) : (
              <span />
            )}
            <span style={styles.charCount}>{name.length}/50</span>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            style={{ ...styles.createBtn, ...(loading ? styles.createBtnDisabled : {}) }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.spinner} />
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Create Group
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
    backdropFilter: "blur(2px)",
  },
  modal: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#111b21",
    borderRadius: "16px",
    border: "1px solid rgba(134,150,160,0.15)",
    boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "20px 20px 16px",
    borderBottom: "1px solid rgba(134,150,160,0.1)",
  },
  iconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "#00a884",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    fontSize: "1.05rem",
    fontWeight: "700",
    color: "#e9edef",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.78rem",
    color: "#8696a0",
    margin: "2px 0 0",
  },
  closeBtn: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    color: "#8696a0",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.15s, color 0.15s",
    flexShrink: 0,
  },
  body: {
    padding: "20px",
  },
  label: {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: "700",
    color: "#8696a0",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    height: "46px",
    padding: "0 14px",
    backgroundColor: "#202c33",
    border: "1px solid rgba(134,150,160,0.2)",
    borderRadius: "10px",
    color: "#e9edef",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  inputError: {
    borderColor: "rgba(241,92,92,0.5)",
  },
  inputMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "6px",
    minHeight: "18px",
  },
  errorText: {
    fontSize: "0.78rem",
    color: "#f15c5c",
  },
  charCount: {
    fontSize: "0.75rem",
    color: "#8696a0",
    marginLeft: "auto",
  },
  footer: {
    display: "flex",
    gap: "10px",
    padding: "0 20px 20px",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    height: "42px",
    padding: "0 20px",
    backgroundColor: "transparent",
    color: "#8696a0",
    border: "1px solid rgba(134,150,160,0.25)",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background-color 0.2s, color 0.2s",
  },
  createBtn: {
    height: "42px",
    padding: "0 20px",
    backgroundColor: "#00a884",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    transition: "background-color 0.2s",
    minWidth: "140px",
    justifyContent: "center",
  },
  createBtnDisabled: {
    backgroundColor: "#005c4b",
    cursor: "not-allowed",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
};

export default CreateGroupModal;