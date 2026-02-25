const express = require("express");
const router = express.Router();

// GET all messages
router.get("/", (req, res) => {
    res.json({
        status: "success",
        messages: [
            { id: 1, text: "Hello LAN Messenger" },
            { id: 2, text: "Server working correctly" }
        ]
    });
});

module.exports = router;
