const express = require("express");
const router = express.Router();

const Room = require("../models/Room");
const auth = require("../middleware/auth");

// =========================
// GET USER ROOMS
// =========================
router.get("/", auth, async (req, res) => {
  try {
    const rooms = await Room.find({
      members: req.user.id,
    });

    return res.json(rooms);
  } catch (err) {
    console.error("Fetch rooms error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// =========================
// CREATE ROOM
// =========================
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const room = await Room.create({
      name,
      members: [req.user.id],
    });

    return res.json(room);
  } catch (err) {
    console.error("Create room error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// =========================
// ADD USER TO ROOM
// =========================
const User = require("../models/User");

router.post("/:roomId/add", auth, async (req, res) => {
  try {
    const { email } = req.body; // 🔥 now using email
    const { roomId } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ msg: "Room not found" });
    }

    if (!room.members.includes(user._id.toString())) {
      room.members.push(user._id.toString());
      await room.save();
    }

    return res.json({ msg: "User added", room });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;