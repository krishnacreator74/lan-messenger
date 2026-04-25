const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Room = require("../models/Room");
const auth = require("../middleware/auth");

// SEND MESSAGE
router.post("/", auth, async (req, res) => {
  const { roomId, text } = req.body;

  const room = await Room.findById(roomId);

  if (!room.members.includes(req.user.id)) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  const message = await Message.create({
    roomId,
    text,
    sender: req.user.name,
    senderId: req.user.id,
  });

  res.json(message);
});

// GET MESSAGES
router.get("/:roomId", auth, async (req, res) => {
  const messages = await Message.find({ roomId: req.params.roomId })
    .sort({ createdAt: 1 });

  res.json(messages);
});

module.exports = router;