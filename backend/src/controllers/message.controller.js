import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";


export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    if (myId.toString() === userToChatId) {
      return res.status(400).json({ message: "Cannot fetch messages for yourself." });
    }

    const receiverExists = await User.exists({ _id: userToChatId });
    if (!receiverExists) {
      return res.status(404).json({ message: "User not found." });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const {
      text,
      image,
      file,
      fileType: incomingFileType,
      fileName: incomingFileName,
      fileSize: incomingFileSize,
    } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    if (!text && !image && !file) {
      return res.status(400).json({ message: "Text or media attachment is required." });
    }

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let finalFileUrl = null;
    let finalFileType = "text";
    let finalFileName = incomingFileName || null;
    let finalFileSize = incomingFileSize || null;

    const attachment = file || image;

    if (attachment) {
      // SMART FIX: Agar attachment ek URL hai (Frontend ne pehle hi upload kar diya hai)
      if (typeof attachment === "string" && attachment.startsWith("http")) {
        finalFileUrl = attachment;
        finalFileType = incomingFileType || "image";
      } else {
        // Agar attachment URL nahi hai (jaise base64 image), tabhi Cloudinary par bhejo
        const uploadResponse = await cloudinary.uploader.upload(attachment, {
          resource_type: "auto",
        });
        finalFileUrl = uploadResponse.secure_url;

        if (incomingFileType) {
          finalFileType = incomingFileType;
        } else if (typeof attachment === "string" && attachment.startsWith("data:audio")) {
          finalFileType = "audio";
        } else if (typeof attachment === "string" && attachment.startsWith("data:video")) {
          finalFileType = "video";
        } else if (uploadResponse.resource_type === "video") {
          finalFileType = "video";
        } else if (uploadResponse.resource_type === "raw") {
          finalFileType = "document";
        } else {
          finalFileType = "image";
        }
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: finalFileType === "image" ? finalFileUrl : undefined,
      fileUrl: finalFileUrl,
      fileType: finalFileType,
      fileName: finalFileName,
      fileSize: finalFileSize,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Saare messages nikalein aur sabse naye (latest) ko upar rakhein
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    }).sort({ createdAt: -1 });

    // Map ka use karke har user ka sirf sabse latest message time save karein
    const partnerMap = new Map();

    messages.forEach((msg) => {
      const partnerId = msg.senderId.toString() === loggedInUserId.toString()
        ? msg.receiverId.toString()
        : msg.senderId.toString();

      if (!partnerMap.has(partnerId)) {
        partnerMap.set(partnerId, msg.createdAt);
      }
    });

    const chatPartnerIds = Array.from(partnerMap.keys());

    // Users ki details fetch karein
    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    // Unhe unke latest message ke time ke hisaab se sort karein
    chatPartners.sort((a, b) => {
      return partnerMap.get(b._id.toString()) - partnerMap.get(a._id.toString());
    });

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
