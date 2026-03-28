const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("audio"), (req, res) => {
  try {
    console.log("FILE RECEIVED:", req.file); // 🔥 debug

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    require("dotenv").config();
    const fileUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

    res.json({ url: fileUrl });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// GET messages by roomId
router.get("/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({
      roomId: req.params.roomId,
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST new message
router.post("/", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

module.exports = router;