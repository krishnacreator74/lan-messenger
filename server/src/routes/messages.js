
const express = require("express");
const router = express.Router();

const messages = []; // memory ಯಲ್ಲಿ store ಮಾಡ್ತೀವಿ

// ಎಲ್ಲಾ messages list ಮಾಡೋದು
router.get("/messages", (req, res) => {
  res.json(messages);
});

// ಹೊಸ message add ಮಾಡೋದು
router.post("/messages", (req, res) => {
  const { roomId, sender, text } = req.body;

  const newMsg = {
    id: "m" + Date.now(),
    roomId,
    sender,
    text,
    time: Date.now(),
  };

  messages.push(newMsg);

  res.status(201).json(newMsg);
});

module.exports = router;