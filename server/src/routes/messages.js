const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Message = require("../models/Message");
const Room = require("../models/Room");
const auth = require("../middleware/auth");

// =========================
// MULTER CONFIG (File Storage)
// =========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists in your root server directory
  },
  filename: (req, file, cb) => {
    // Saves file as: 16738294.mp3
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// =========================
// UPLOAD AUDIO ROUTE (The missing piece)
// =========================
router.post("/upload", auth, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // Construct the URL to the file
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const { roomId } = req.body; // <-- ADD THIS LINE

    // Note: We don't save to the DB here because your frontend sends 
    // a separate socket message after the upload succeeds.
    const message = await Message.create({
      roomId,
      type: "audio",
      audioUrl: fileUrl,
      text: "",
      sender: req.user.name,
      senderId: req.user.id,
      timestamp: new Date(),
    });
    res.json({ url: fileUrl, _id: message._id });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ msg: "Server error during upload" });
  }
});

// =========================
// SEND MESSAGE
// =========================
router.post("/", auth, async (req, res) => {
  try {
    const { roomId, text } = req.body;

    // Check room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    // Check membership
    if (!room.members.includes(req.user.id)) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    // Create message
    const message = await Message.create({
      roomId,
      text,
      sender: req.user.name,
      senderId: req.user.id,
    });

    return res.json(message);
  } catch (err) {
    console.error("Send message error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// =========================
// GET MESSAGES
// =========================
router.get("/:roomId", auth, async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (err) {
    console.error("Fetch messages error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;