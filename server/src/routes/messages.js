const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

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