const { Server } =require( "socket.io");
const http =require( "http");
const express =require( "express");
const Message =require( "../models/message.js");
const Conversation =require( "../models/conversation.js");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Function to get recipient's socket ID, considering user/coach type
const getRecipientSocketId = (recipientId, isCoach) => {
  if (isCoach) {
    return coachSocketMap[recipientId]; 
  } else {
    return userSocketMap[recipientId];
  }
};

const userSocketMap = {}; // userId: socketId
const coachSocketMap = {};

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  const userId = socket.handshake.query.userId;
  const isCoach = socket.handshake.query.isCoach === "true"; // Assuming isCoach is sent in query

  if (userId !== "undefined") {
    if (isCoach) {
      coachSocketMap[userId] = socket.id;
    } else {
      userSocketMap[userId] = socket.id;
    }
  }

  // Emit online users/coaches based on your implementation
  io.emit("getOnlineUsers", { users: Object.keys(userSocketMap), coaches: Object.keys(coachSocketMap) });

  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      await Message.updateMany({ conversationId, seen: false }, { $set: { seen: true } });
      await Conversation.updateOne({ _id: conversationId }, { $set: { "lastMessage.seen": true } });

      // Emit messagesSeen event to appropriate recipient (user or coach)
      const recipientSocketId = getRecipientSocketId(userId, isCoach);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("messagesSeen", { conversationId });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (isCoach) {
      delete coachSocketMap[userId];
    } else {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", { users: Object.keys(userSocketMap), coaches: Object.keys(coachSocketMap) });
  });
});

module.exports = { io, server, app , getRecipientSocketId };