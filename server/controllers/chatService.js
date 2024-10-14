// // const express = require("express");
// // const cors = require("cors");
// // const axios = require("axios");

// // const app = express();
// // app.use(express.json());
// // app.use(cors({ origin: true }));

// // app.post("/authenticate", async (req, res) => {
// //   const { username } = req.body;

// //   try {
// //     const r = await axios.put(
// //         "https://api.chatengine.io/users/",
// //         {username: username, secret: username, first_name: username},
// //         {headers: {"private-key" : "ede673c4-66e1-4fd0-afad-112c2ffcea0d"}}
// //     );
// //     return res.status(r.status).json(r.data);
// //   } catch(e) {
// //     return res.status(e.response.status).json(e.response.data);
// //   }
// // });

// // app.listen(5000, () => {
// //     console.log(`Server is listening on port ${5000}`);
// // });

// const Chat = require("../models/chatModel");
// const User = require("../models/User");
// const ChatRequest = require("../models/chatRequest");

// //@description     Create or fetch One to One Chat
// // const accessChat = async (req, res) => {
// //   const { userId } = req.body;

// //   if (!userId) {
// //     console.log("UserId param not sent with the request");
// //     return res.sendStatus(400);
// //   }

// //   try {
// //     // Check if there is a chat request with "Accepted" status from both sender and receiver perspective
// //     const senderChatRequest = await ChatRequest.findOne({
// //       sender: req.user.userId,
// //       receiver: userId,
// //       status: "Accepted",
// //     });

// //     const receiverChatRequest = await ChatRequest.findOne({
// //       sender: userId,
// //       receiver: req.user.userId,
// //       status: "Accepted",
// //     });

// //     if (senderChatRequest || receiverChatRequest) {
// //       const isChat = await Chat.find({
// //         isGroupChat: false,
// //         $or: [
// //           { users: { $elemMatch: { $eq: req.user._id } } },
// //           { users: { $elemMatch: { $eq: userId } } },
// //         ],
// //       })
// //         .populate("users", "-password")
// //         .populate("latestMessage");

// //       if (isChat.length > 0) {
// //         res.send(isChat[0]);
// //       } else {
// //         const chatData = {
// //           chatName: "Private Chats",
// //           isGroupChat: false,
// //           users: [req.user.userId, userId],
// //         };
// //         const createdChat = await Chat.create(chatData);
// //         const fullChat = await Chat.findOne({ _id: createdChat._id })
// //           .populate("users", "-password");
// //         res.status(200).json(fullChat);
// //       }
// //     } else {
// //       // Chat request not accepted, return an error or appropriate response
// //       res.status(400).json({ message: "Chat request not accepted" });
// //     }
// //   } catch (error) {
// //     res.status(400);
// //     throw new Error(error.message);
// //   }
// // };

// const accessChat = async (req, res) => {
//   const { userId } = req.body;

//   if (!userId) {
//     console.log("UserId param not sent with the request");
//     return res.sendStatus(400);
//   }

//   try {
//     // Check if there is a chat request with "Accepted" status from both sender and receiver perspective
//     const senderChatRequest = await ChatRequest.findOne({
//       sender: req.user.userId,
//       receiver: userId,
//       status: "Accepted",
//     });

//     const receiverChatRequest = await ChatRequest.findOne({
//       sender: userId,
//       receiver: req.user.userId,
//       status: "Accepted",
//     });

//     if (senderChatRequest || receiverChatRequest) {
//       // Check if a chat already exists for these users
//       let existingChat = await Chat.findOne({
//         users: { $all: [req.user.userId, userId] },
//       })
//         .populate({
//           path: "users",
//           select: "-password", // Exclude password
//         })
//         .populate("latestMessage");

//       if (!existingChat) {
//         // If no chat exists, create a new one
//         const chatData = {
//           chatName: "Private Chats",
//           users: [req.user.userId, userId],
//         };
//         existingChat = await Chat.create(chatData);
//       }

//       // Send the response with user information
//       const usersInfo = existingChat.users.map((user) => ({
//         _id: user._id,
//         name: user.name,
//       }));

//       const response = {
//         _id: existingChat._id,
//         chatName: existingChat.chatName,
//         users: usersInfo,
//         latestMessage: existingChat.latestMessage,
//       };

//       return res.status(200).json(response);
//     } else {
//       // Chat request not accepted, return an error or appropriate response
//       return res.status(400).json({ message: "Chat request not accepted" });
//     }
//   } catch (error) {
//     // Handle errors and send response
//     return res.status(400).json({ error: error.message });
//   }
// };

// //@description     Fetch all chats for a user
// const fetchChats = async (req, res) => {
//   try {
//     const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } }})
//       .populate("users", "-password")
//       .populate("latestMessage")
//       .sort({ updatedAt: -1 })
//       .exec();
//     await User.populate(results, {
//       path: "latestMessage.sender",
//       select: "name pic email",
//     });
//     res.status(200).send(results);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// };

// module.exports = {
//   accessChat,
//   fetchChats,
// };

const Chat = require("../models/chatModel");
const User = require("../models/User");
const ChatRequest = require("../models/chatRequest");

//@description     Create or fetch One to One Chat
// const accessChat = async (req, res) => {
//   const { userId } = req.body;

//   if (!userId) {
//     console.log("UserId param not sent with the request");
//     return res.sendStatus(400);
//   }

//   try {
//     // Check if there is a chat request with "Accepted" status from both sender and receiver perspective
//     const senderChatRequest = await ChatRequest.findOne({
//       sender: req.user.userId,
//       receiver: userId,
//       status: "Accepted",
//     });

//     const receiverChatRequest = await ChatRequest.findOne({
//       sender: userId,
//       receiver: req.user.userId,
//       status: "Accepted",
//     });

//     if (senderChatRequest || receiverChatRequest) {
//       // Check if a chat already exists for these users
//       let existingChat = await Chat.findOne({
//         isGroupChat: false,
//         users: { $all: [req.user.userId, userId] },
//       }).populate("users", "-password");

//       console.log(existingChat);

//       if (!existingChat) {
//         // If no chat exists, create a new one
//         const chatData = {
//           chatName: "Private Chats",
//           isGroupChat: false,
//           users: [req.user.userId, userId],
//         };
//         const createdChat = await Chat.create(chatData);
//         const fullChat = await Chat.findOne({ _id: createdChat._id })
//           .populate("users", "-password");
//         res.status(200).json(fullChat);
//       }

//       res.status(200).json(existingChat);
//     } else {
//       // Chat request not accepted, return an error or appropriate response
//       res.status(400).json({ message: "Chat request not accepted" });
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with the request");
    return res.sendStatus(400);
  }

  try {
    // Check if there is a chat request with "Accepted" status from both sender and receiver perspective
    const senderChatRequest = await ChatRequest.findOne({
      sender: req.user.userId,
      receiver: userId,
      status: "Accepted",
    });

    const receiverChatRequest = await ChatRequest.findOne({
      sender: userId,
      receiver: req.user.userId,
      status: "Accepted",
    });

    if (senderChatRequest || receiverChatRequest) {
      // Check if a chat already exists for these users
      let existingChat = await Chat.findOne({
        users: { $all: [req.user.userId, userId] },
      })
        .populate({
          path: "users",
          select: "-password", // Exclude password
        })
        .populate("latestMessage");

      if (!existingChat) {
        // If no chat exists, create a new one
        const chatData = {
          chatName: "Private Chats",
          users: [req.user.userId, userId],
        };
        existingChat = await Chat.create(chatData);
      }

      // Send the response with user information
      const usersInfo = existingChat.users.map((user) => ({
        _id: user._id,
        name: user.name,
        pic: user.pic,
      }));

      const response = {
        _id: existingChat._id,
        chatName: existingChat.chatName,
        users: usersInfo,
        latestMessage: existingChat.latestMessage,
      };
      console.log(response);
      return res.status(200).json(response);
    } else {
      // Chat request not accepted, return an error or appropriate response
      return res.status(400).json({ message: "Chat request not accepted" });
    }
  } catch (error) {
    // Handle errors and send response
    return res.status(400).json({ error: error.message });
  }
};

//@description     Fetch all chats for a user
const fetchChats = async (req, res) => {
  try {
    const results = await Chat.find({
      users: { $elemMatch: { $eq: req.user.userId } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .exec();
    await User.populate(results, {
      path: "latestMessage.sender",
      select: "name email",
    });
    res.status(200).send(results);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  accessChat,
  fetchChats,
};
