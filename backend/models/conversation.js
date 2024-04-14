const mongoose = require( "mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, enum: ["user", "coach"], required: true },
      },
    ],
    lastMessage: {
      text: String,
      sender: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, enum: ["user", "coach"], required: true },
      },
      seen: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;