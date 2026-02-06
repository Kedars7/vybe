import Message from "../models/Message.js";
import { io, userSocketMap } from "../../server.js";
import User from "../models/User.js";

//Get all users
export const getAllUsers = async (req, res) => {
  try {
    const userId = req.userId;

    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password -email -createdAt -updatedAt -__v",
    );

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);
    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.log("Failed at getAllUsers, ", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to fetch users" });
  }
};

//get all messages between logged in user and a friend
const getMessages = async (req, res) => {
  try {
    const friendId = req.params.id;
    const userId = req.userId;

    const message = await Message.find({
      $or: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    });

    await Message.updateMany(
      {
        senderId: friendId,
        receiverId: userId,
      },
      { seen: true },
    );

    return res
      .status(200)
      .json({
        success: true,
        message: "Messages fetched successfully",
        messages: message,
      });
  } catch (error) {
    console.log("Failed at getMessages, ", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to fetch messages" });
  }
};

const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    await Message.findByIdAndUpdate(id, { seen: true });

    return res
      .status(200)
      .json({ success: true, message: "Message marked as seen" });
  } catch (error) {
    console.log("Failed at markMessageAsSeen, ", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to mark messages as seen" });
  }
};

const markAllMessagesAsSeen = async (req, res) => {
  try {
    const userId = req.userId;
    const senderId = req.params.id;

    await Message.updateMany(
      {
        senderId: senderId,
        receiverId: userId,
        seen: false,
      },
      { seen: true },
    );

    return res
      .status(200)
      .json({ success: true, message: "All messages marked as seen" });
  } catch (error) {
    console.log("Failed at markAllMessagesAsSeen, ", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to mark messages as seen" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const receiverId = req.params.id;
    const senderId = req.userId;

    //Add that receiver to sender's friends list if not already present
    const sender = await User.findById(senderId);
    if (!sender.friends.includes(receiverId)) {
      sender.friends.push(receiverId);
      await sender.save();
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
    });

    //Emit the new message to the receiver
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Message sent successfully",
        newMessage,
      });
  } catch (error) {
    console.log("Failed at sendMessage, ", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to send message" });
  }
};

const getAllFriends = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate(
      "friends",
      "-password -email -createdAt -updatedAt -__v",
    );

    // Get unseen message counts for each friend
    const unseenMessages = {};
    const promises = user.friends.map(async (friend) => {
      const messages = await Message.find({
        senderId: friend._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[friend._id] = messages.length;
      }
    });

    await Promise.all(promises);

    return res
      .status(200)
      .json({
        success: true,
        message: "Friends fetched successfully",
        friends: user.friends,
        unseenMessages,
      });
  } catch (error) {
    console.log("Failed at getAllFriends, ", error);
    return res
      .status(400)
      .json({ success: false, message: "Failed to fetch friends" });
  }
};

export {
  getMessages,
  markMessageAsSeen,
  markAllMessagesAsSeen,
  sendMessage,
  getAllFriends,
};
