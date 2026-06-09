import { User } from "../models/user.model.js";
import { apiError, apiResponse, asyncHandler } from "../utils/index.js";
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import { Message } from "../models/message.model.js";
// POST /api/messages/send/:username  (public)
export const sendMessage = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { content } = req.body;

  if (!content) throw new apiError(400, "Message content is required");

  const user = await User.findOne({ username });
  if (!user) throw new apiError(404, "User not found");
  if (!user.isAcceptingMessages) throw new apiError(403, "User is not accepting messages");

  const threadToken = randomUUID();

  const message = await Message.create({
    content,
    createdAt: new Date(),
    threadToken,
    user: user._id

  })



  user.messages.push(message._id);
  await user.save();

  return res.status(201).json(
    new apiResponse(201, { threadToken }, "Message sent. Save your thread token to check replies.")
  );
});

// GET /api/messages  (protected)
export const getMessages = asyncHandler(async (req, res) => {

  const result = await User.aggregate([
    {
       $match: { _id: req.user._id }
    },
    {
      $lookup: {
        from: "messages",           
        localField: "messages",
        foreignField: "_id",
        as: "messages",
        pipeline: [
          { $match: { user: req.user._id } }    
        ]
      }
    },
    { 
      $unwind: { 
        path: "$messages", 
        preserveNullAndEmptyArrays: true 
      }
    },
    { 
      $sort: { "messages.createdAt": -1 } 
    },
    { 
      $group: { _id: "$_id", messages: { $push: "$messages" } } 
    },
    {
      $project: {
        _id: 0,
        messages: 1
      }
    }
  ]);

const messages = result[0]?.messages || [];
  return res.status(200).json(
    new apiResponse(200, { messages }, "Messages fetched")
  );
});

// DELETE /api/messages/:messageId  (protected)
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  if (!messageId) {
    throw new apiError(400, "Message ID is required");
  }

  const deletedMessage = await Message.findOneAndDelete({
    _id: messageId,
    user: req.user._id

  });

  if (!deletedMessage) {
    throw new apiError(404, "Message not found or you don't have permission");
  }
  await User.updateOne(
    { _id: req.user._id },
    { $pull: { messages: messageId } }
  );

  

  return res.status(200).json(new apiResponse(200, {}, "Message deleted successfully"));
});

// POST /api/messages/reply/:messageId  (protected)
export const replyToMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { reply } = req.body;

  if (!reply) {
    throw new apiError(400, "Reply content is required");
  }

  if (!messageId) {
    throw new apiError(400, "Message ID is required");
  }

  const message = await Message.findOne({
    _id: messageId,
    user: req.user._id        
  });

  if (!message) {
    throw new apiError(404, "Message not found or you don't have permission");
  }

  if (message.reply !== null) {
    throw new apiError(400, "Already replied to this message");
  }
  message.reply = reply;
  await message.save();

  return res.status(200).json(
    new apiResponse(200, { reply }, "Reply sent successfully")
  );
});

export const checkMsgReplyThroughThread = asyncHandler(async (req, res) => {
  const { threadToken } = req.params;

  if (!threadToken) {
    throw new apiError(400, "Thread token is required");
  }

  const message = await Message.findOne({ threadToken }).populate("user" ,"username");

  if (!message) {
    throw new apiError(404, "Thread not found");
  }
  // if (message.user && message.user.toString() !== req.user?._id?.toString()) {
  //   throw new apiError(403, "You don't have permission to view this reply");
  // }

  return res.status(200).json(
    new apiResponse(200, {
      content: message.content,
      reply: message.reply || null,
      createdAt: message.createdAt,
      threadToken: message.threadToken,
      username: message.user?.username || null
    }, "Thread fetched successfully")
  );
});