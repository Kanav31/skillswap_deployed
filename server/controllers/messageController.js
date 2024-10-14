// const asyncHandler = require("express-async-handler");
// const Message = require("../models/messageModel");
// const User = require("../models/User");
// const Chat = require("../models/chatModel");

// //@description     Get all Messages
// //@route           GET /api/Message/:chatId
// const allMessages = asyncHandler(async (req, res) => {
//   try {
//     const messages = await Message.find({ chat: req.params.chatId })
//       .populate("sender", "name pic email")
//       .populate("chat");
//     res.json(messages);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// //@description     Create New Message
// const sendMessage = asyncHandler(async (req, res) => {
//   const { content, chatId } = req.body;

//   if (!content || !chatId) {
//     return res.status(400).json({ error: "Invalid data passed into request" });
//   }

//   try {
//     const newMessage = {
//       sender: req.user.userId,
//       content,
//       chat: chatId,
//     };

//     const message = await Message.create(newMessage);

//     const populatedMessage = await Message.findById(message._id)
//       .populate("sender", "name")
//       .populate("chat")
//       .exec();

//     const populatedUserMessage = await User.populate(populatedMessage, {
//       path: "chat.users",
//       select: "name email",
//     });

//     await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: populatedUserMessage });

//     res.json(populatedUserMessage);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = { allMessages, sendMessage };

const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/User");
const Chat = require("../models/chatModel");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate({
        path: "sender",
        select: "name pic email _id", // Include the fields you want to return
      })
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//@description     Create New Message
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ error: "Invalid data passed into request" });
  }

  try {
    const newMessage = {
      sender: req.user.userId,
      content,
      chat: chatId,
    };

    const message = await Message.create(newMessage);

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name pic")
      .populate("chat")
      .exec();

    const populatedUserMessage = await User.populate(populatedMessage, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: populatedUserMessage,
    });

    res.json(populatedUserMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = { allMessages, sendMessage };
