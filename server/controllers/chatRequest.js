// controllers/chatRequestsController.js
const User = require('../models/User');
const UserProfile = require('../models/userProfile');
const ChatRequest = require("../models/chatRequest");

// Send a chat request
const sendChatRequest = async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    const chatRequest = new ChatRequest({ sender, receiver });
    await chatRequest.save();
    res.status(201).json(chatRequest);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
// Accept a chat request
const acceptChatRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log(requestId);
    const chatRequest = await ChatRequest.findByIdAndUpdate(
      requestId,
      { status: "Accepted" },
      { new: true }
    );
    console.log(chatRequest);
    if (!chatRequest) {
      return res.status(404).json({ error: "Chat request not found" });
    }
    res.status(200).json(chatRequest);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reject a chat request
const rejectChatRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log(requestId);
    const chatRequest = await ChatRequest.findByIdAndUpdate(
      requestId,
      { status: "Rejected" },
      { new: true }
    );
    if (!chatRequest) {
      return res.status(404).json({ error: "Chat request not found" });
    }
    res.status(200).json(chatRequest);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all chat requests
const getReceivedChatRequests = async (req, res) => {
  const receiverId = req.user.userId;

  try {
    const pendingRequests = await ChatRequest.find({ receiver: receiverId, status: 'Pending' })
      .populate({
        path: 'sender',
        select: 'name email',
        model: 'User',
      });

    const senderUserIds = pendingRequests.reduce((acc, request) => {
      if (request.sender) acc.push(request.sender._id);
      return acc;
    }, []);

    const senderUserProfiles = await UserProfile.find({
      createdBy: { $in: senderUserIds },
    }).select('pic createdBy');

    const populatedRequests = pendingRequests.map(request => {
      const senderProfile = senderUserProfiles.find(profile => profile.createdBy.equals(request.sender?._id));

      // Only populate if senderProfile is available
      const populatedSender = senderProfile
        ? { ...request.sender?.toObject(), userProfile: { pic: senderProfile.pic } }
        : request.sender?.toObject();

      return {
        ...request.toObject(),
        sender: populatedSender,
      };
    });

    res.status(200).json(populatedRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
// const getReceivedChatRequests = async (req, res) => {
//   const receiverId = req.user.userId; // user which has recived this request that ID

//   try {
//     const pendingRequests = await ChatRequest.find({
//       receiver: receiverId,
//       status: "Pending",
//     }).populate("sender", "name");

//     res.status(200).json(pendingRequests);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// confirmed matches of logged user
// const getYourConfirmedMatches = async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const confirmedMatches = await ChatRequest.find({
//       $or: [
//         { sender: userId, status: "Accepted" },
//         { receiver: userId, status: "Accepted" },
//       ],
//     })
//       .populate("sender", "name pic email") // Replace with the actual fields you want to populate
//       .populate("receiver", "name pic email");
//     res.status(200).json({ matches: confirmedMatches });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

const getYourConfirmedMatches = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Step 1: Find confirmed matches and populate User details
    const confirmedMatches = await ChatRequest.find({
      $or: [
        { sender: userId, status: 'Accepted' },
        { receiver: userId, status: 'Accepted' },
      ],
    })
      .populate({
        path: 'sender',
        select: 'name email',
        model: 'User',
      })
      .populate({
        path: 'receiver',
        select: 'name email',
        model: 'User',
      });

    // Step 2: Extract user IDs from confirmed matches and populate UserProfile details
    const userIds = confirmedMatches.reduce((acc, match) => {
      if (match.sender) acc.push(match.sender._id);
      if (match.receiver) acc.push(match.receiver._id);
      return acc;
    }, []);

    const userProfiles = await UserProfile.find({
      createdBy: { $in: userIds },
    }).select('pic createdBy');

    // Step 3: Combine User and UserProfile details
    const populatedMatches = confirmedMatches.map(match => {
      const senderProfile = userProfiles.find(profile => profile.createdBy.equals(match.sender?._id));
      const receiverProfile = userProfiles.find(profile => profile.createdBy.equals(match.receiver?._id));

      return {
        ...match.toObject(),
        sender: {
          ...match.sender?.toObject(),
          userProfile: senderProfile,
        },
        receiver: {
          ...match.receiver?.toObject(),
          userProfile: receiverProfile,
        },
      };
    });

    res.status(200).json({ matches: populatedMatches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  sendChatRequest,
  acceptChatRequest,
  rejectChatRequest,
  getReceivedChatRequests,
  getYourConfirmedMatches,
};
