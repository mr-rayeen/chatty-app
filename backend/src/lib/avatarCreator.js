import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import parseDataUri from "parse-data-uri";
import cloudinary from "./cloudinary.js";
import axios from "axios";

const avatarCreator = async (fullName) => {

    try {
        const avatar = createAvatar(adventurer, {
                seed: fullName,
            });
    
            const avatarDataUri = avatar.toDataUri();
            const parsed = parseDataUri(avatarDataUri);
            const buffer = parsed.data;
            
            let uploadResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { resource_type: "image" },
                        (error, result) => {
                            if (error) {
                                reject(new Error("Cloudinary upload error"));
                            } else {
                                resolve(result);
                            }
                        }
                    )
                    .end(buffer);
            });

        const response = await axios.get("")

            return uploadResponse.secure_url;
    } catch (error) {
        console.log("Error while creating Avatar", error)
        return null;
    }
}

export default avatarCreator;