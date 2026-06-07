import { User } from "../models/user.model.js";
import { apiError, apiResponse, asyncHandler } from "../utils/index.js";
import mongoose from "mongoose";
import { randomUUID } from "crypto";

// POST /api/messages/send/:username  (public)
export const sendMessage = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { content } = req.body;

  if (!content) throw new apiError(400, "Message content is required");

  const user = await User.findOne({ username });
  if (!user) throw new apiError(404, "User not found");
  if (!user.isAcceptingMessages) throw new apiError(403, "User is not accepting messages");

  const threadToken = randomUUID();

  user.messages.push({ content, createdAt: new Date(), threadToken });
  await user.save();

  return res.status(201).json(
    new apiResponse(201, { threadToken }, "Message sent. Save your thread token to check replies.")
  );
});

// GET /api/messages  (protected)
export const getMessages = asyncHandler(async (req, res) => {
  const userId = { $match: { _id: req.user._id } }

  const result = await User.aggregate([
    { $match: { _id: userId } },
    { $unwind: "$messages" },
    { $sort: { "messages.createdAt": -1 } },
    { $group: { _id: "$_id", messages: { $push: "$messages" } } },
  ]);

  if (!result || result.length === 0) throw new apiError(404, "No messages found");

  return res.status(200).json(
    new apiResponse(200, { messages: result[0].messages }, "Messages fetched")
  );
});

// DELETE /api/messages/:messageId  (protected)
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const updateResult = await User.updateOne(
    { _id: req.user._id },
    { $pull: { messages: { _id: messageId } } }
  );

  if (updateResult.modifiedCount === 0) {
    throw new apiError(404, "Message not found or already deleted");
  }

  return res.status(200).json(new apiResponse(200, {}, "Message deleted"));
});

// POST /api/messages/reply/:messageId  (protected)
export const replyToMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  const { reply } = req.body;

  if (!reply) throw new apiError(400, "Reply content is required");

  const user = await User.findOne({
    _id: req.user._id,
    "messages._id": messageId,
  });
  if (!user) throw new apiError(404, "Message not found");

  const message = user.messages.id(messageId);
  if (message.reply) throw new apiError(400, "Already replied to this message");

  message.reply = reply;
  await user.save();

  return res.status(200).json(new apiResponse(200, {}, "Reply sent"));
});

// GET /api/messages/thread/:threadToken  (public — sender uses this)
export const checkMsgReplyThroughThread = asyncHandler(async (req, res) => {
  const { threadToken } = req.params;

  const user = await User.findOne({ "messages.threadToken": threadToken });
  if (!user) throw new apiError(404, "Thread not found");

  const message = user.messages.find((m) => m.threadToken === threadToken);

  return res.status(200).json(
    new apiResponse(200, {
      content: message.content,
      reply: message.reply || null,
      createdAt: message.createdAt,
    }, "Thread fetched")
  );
});
