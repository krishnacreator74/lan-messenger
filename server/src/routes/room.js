const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// GET all rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error("GET /rooms error:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// CREATE new room
router.post("/", async (req, res) => {
  try {
    console.log("Room body received:", req.body);

    const newRoom = new Room(req.body);
    const savedRoom = await newRoom.save();

    res.json(savedRoom);
  } catch (error) {
    console.error("POST /rooms error:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

module.exports = router;