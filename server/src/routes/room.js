const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const auth = require("../middleware/auth");

// GET rooms (only user rooms)
router.get("/", auth, async (req, res) => {
  const rooms = await Room.find({
    members: req.user.id,
  });

  res.json(rooms);
});

// CREATE room
router.post("/", auth, async (req, res) => {
  const { name } = req.body;

  const room = await Room.create({
    name,
    members: [req.user.id],
  });

  res.json(room);
});

// ADD USER TO ROOM
router.post("/:roomId/add", auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const roomId = req.params.roomId;

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ msg: "Room not found" });

    // avoid duplicate
    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    res.json({ msg: "User added", room });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;