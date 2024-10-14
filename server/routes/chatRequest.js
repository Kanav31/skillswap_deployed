// routes/chatRequests.js
const express = require('express');
const router = express.Router();
const {sendChatRequest,acceptChatRequest, rejectChatRequest, getReceivedChatRequests, getYourConfirmedMatches} = require('../controllers/chatRequest');

// Send a chat request
router.post('/sendRequest', sendChatRequest);

// get All pending chat request of a user
router.get('/getAllRequest', getReceivedChatRequests)

// Accept a chat request
router.patch('/acceptRequest/:requestId', acceptChatRequest);

// Reject a chat request
router.patch('/rejectRequest/:requestId', rejectChatRequest);

// Confirm Matches sow route
router.get('/getAllAcceptedRequest', getYourConfirmedMatches)

module.exports = router;