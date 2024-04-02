const Conversation = require( "../models/conversation.js");
const Message = require( "../models/message.js");
const { getRecipientSocketId, io } = require( "../utils/socket.js");
const cloudinary = require("cloudinary").v2 ;

async function sendMessage(req, res) {
  try {
    const { recipientId, message, isCoach } = req.body;
    let { img } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          { id: senderId, type: "user" },
          { id: recipientId, type: isCoach ? "coach" : "user" },
        ],
      },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [
          { id: senderId, type: "user" },
          { id: recipientId, type: isCoach ? "coach" : "user" },
        ],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "",
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    const recipientSocketId = getRecipientSocketId(recipientId, isCoach); // Adapt for coach connections
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getMessages(req, res) {
  const { otherUserId, isCoach } = req.params;
  const userId = req.user._id;
  try {
    const conversation = await Conversation.findOne({
      participants: {
        $all: [
          { id: userId, type: "user" },
          { id: otherUserId, type: isCoach ? "coach" : "user" },
        ],
      },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getConversations(req, res) {
  const userId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: { $elemMatch: { id: userId, type: "user" } },
    }).populate({
      path: "participants.id",
      select: "username profilePic",
      model: function (participant) {
        return participant.type === "user" ? "user" : "coach"; // Dynamic model selection
      },
    });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { sendMessage, getMessages, getConversations };