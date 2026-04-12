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

module.exports = router;