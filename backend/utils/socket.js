import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Function to get recipient's socket ID, considering user/coach type
export const getRecipientSocketId = (recipientId, isCoach) => {
  if (isCoach) {
    return coachSocketMap[recipientId]; // Example using coachSocketMap
  } else {
    return userSocketMap[recipientId];
  }
};

const userSocketMap = {}; // userId: socketId
const coachSocketMap = {}; // coachId: socketId (example)

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

export { io, server, app };