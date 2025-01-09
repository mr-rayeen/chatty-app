import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    
    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long!" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ email, fullName, password: hashedPassword });

        if (newUser) {
            //Generate jwt token
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                message: "User created successfully!",
                user: {
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                },
            });
        } else {
            res.status(400).json({ message: "Invalid user data!" });
        }


    } catch (error) {
        console.log("Error in signup Controller",error.message);
        return res.status(500).json({ message: "Internal Server Error!" });
    }

}

export const login = async (req, res)=>{
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const user = await User.findOne({ email });

        if (user) {
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                generateToken(user._id, res);
                return res.status(200).json({
                    message: "User logged in successfully!",
                    user: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        profilePic: user.profilePic,
                    },
                });
            } else {
                return res.status(400).json({ message: "Invalid credentials!" });
            }
        } else {
            return res.status(400).json({ message: "User does not exist!" });
        }
    } catch (error) {
        console.log("Error in login Controller",error.message);
        return res.status(500).json({ message: "Internal Server Error!" });
    }

}

export const logout = (req, res)=>{
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        });
        return res.status(200).json({ message: "User logged out successfully!" });
        
    } catch (error) {
        console.log("Error in logout Controller",error.message);
        return res.status(500).json({ message: "Internal Server Error!" });
        
    }

}

export const updateProfile = async (req, res) => {
    
    try {
        const userId = req.user._id;
        // console.log(req.files.profilePic);

        if (!req.files) {
            return res.status(400).json({ message: "Profile Pic is required!" });
        }

        const uploadResponse = await cloudinary.uploader.upload(req.files.profilePic.tempFilePath);
        // console.log(uploadResponse);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");

        res.status(200).json({
            message: "Profile Pic updated successfully!",
            user: updatedUser
        });
        
    } catch (error) {
        console.log("Error in updateProfile Controller",error.message);
        return res.status(500).json({ message: "Internal Server Error!" });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (error) {
        console.log("Error in checkAuth Controller",error.message);
        return res.status(500).json({ message: "Internal Server Error!" });
    }
}