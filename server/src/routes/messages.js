const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

<<<<<<< Updated upstream
const messages = require("../data/messages");

// GET all messages
router.get("/messages", (req, res) => {
  res.json(messages);
});

// POST new message
router.post("/messages", (req, res) => {
  const { roomId, sender, text, type, audioUrl } = req.body;

  const newMsg = {
    id: "m" + Date.now(),
    roomId,
    sender,
    text: text || null,
    type: type || "text",
    audioUrl: audioUrl || null,
    time: Date.now(),
  };

  messages.push(newMsg);

  res.status(201).json(newMsg);
=======
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
>>>>>>> Stashed changes
});

module.exports = router;


