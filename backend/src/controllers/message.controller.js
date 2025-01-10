import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filtertedUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        return res.status(200).json(filtertedUsers);

    } catch (error) {
        console.log("Error in getUsersForSidebar Controller", error.message);
        return res.status(500).json({ message: "Internal Server Error!" });
        
    }
}

export const getMessages = async (req, res) => {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    try {
        
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ],
        });

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages Controller", error.message);
        return res.status(500).json({ message: "Internal Server Error!" });
    }
};

export const sendMessage = async (req, res) => {
    const { id: receiverId } = req.params;
    const {text, image} = req.body;
    const senderId = req.user._id;
    
    
    try {
        let imageUrl;
        if (req.files) {
            const uploadResponse = await cloudinary.uploader.upload(req.files.image.tempFilePath);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // Realtime functionality of chat will be implemented here
       
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
         
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage Controller", error.message);
        return res.status(500).json({ message: "Internal Server Error! at send message." });
    }
}