const express = require("express");
const router = express.Router();

const rooms = require("../data/rooms");

// GET /rooms
router.get("/", (req, res) => {
  res.json(rooms);
});

module.exports = router;
