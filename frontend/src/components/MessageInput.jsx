import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessages, isImageUploading } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file!");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }

    const removeImagePreview = () => {
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = null;
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        let file = null;
        if (imagePreview) {
            file = fileInputRef.current.files[0];
		}

        if (!text.trim() && !imagePreview) return;
        
        const formData = new FormData();
        formData.append("text", text.trim());
        if (file) {
            formData.append("image", file);
        }

        try {
            await sendMessages(formData);

            // Clear form
            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = null;
            
        } catch (error) {
            console.error("Failded to send message: ", error);
            toast.error("Failed to send message");
        }
    };

  return (
		<div className="p-4 w-full">
			{imagePreview && (
				<div className="mb-3 flex items-center gap-2">
					<div className="relative">
						<img
							src={imagePreview}
							alt="Preview"
							className="w-20 h-20 object-cover rounded-lg border border-zinc-700 "
						/>
						<button
							onClick={removeImagePreview}
							className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                            flex items-center justify-center"
							type="button"
						>
							<X className="size-3" />
						</button>
						{isImageUploading && (<div className="absolute left-28 md:left-80 bottom-3 border p-1 px-2 border-zinc-500/20 animate-pulse rounded-lg w-max text-xs">
							<div>Uploading Image...</div>
						</div>)}
					</div>
				</div>
			)}

			<form
				onSubmit={handleSendMessage}
				className="flex items-center gap-2"
			>
				<div className="flex-1 flex gap-2">
					<input
						type="text"
						className="w-full input input-bordered rounded-lg input-md "
						placeholder="Type a message"
						value={text}
						onChange={(e) => setText(e.target.value)}
					/>
					<input
						type="file"
						className="hidden"
						accept="image/*"
						ref={fileInputRef}
						onChange={handleImageChange}
					/>
					<button
						type="button"
						className={`sm:flex btn btn-circle
                                ${
								imagePreview
									? "text-emerald-500 "
									: "text-zinc-400"
							}`}
						onClick={() => fileInputRef.current?.click()}
					>
						<Image className="h-5 w-5 " />
					</button>
				</div>
				<button
					type="submit"
					className={`btn btn-circle ${
						imagePreview || text
							? "text-emerald-500 "
							: "text-zinc-400"
					} `}
					disabled={!text.trim() && !imagePreview}
				>
					<Send size={22} />
				</button>
			</form>
		</div>
  );
}

export default MessageInput