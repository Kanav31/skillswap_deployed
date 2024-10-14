const express = require("express");
const { allMessages, sendMessage } = require("../controllers/messageController");

const router = express.Router();

// Get all messages for a specific chat
router.route("/all-message/:chatId").get(allMessages);

// Send a message to a chat
router.route("/send-message").post(sendMessage);

module.exports = router;
