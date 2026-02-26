const express = require("express");
const router = express.Router();

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
});

module.exports = router;