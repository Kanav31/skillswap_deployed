const express = require("express");
const { accessChat, fetchChats } = require("../controllers/chatService");

const router = express.Router();

// Create a chat between two individuals
router.route("/access-chats").post(accessChat);

// Get a list of chats for the authenticated user
router.route("/fetch-chats").get(fetchChats);

module.exports = router;
