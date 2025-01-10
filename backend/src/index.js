import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import {app, server} from "./lib/socket.js"


dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();


app.use(
	cors({
        origin:true,
        //     [
		// 	"http://localhost:5173",
		// 	"https://chatty-app-eta.vercel.app/",
		// 	"https://chatty-app-git-main-mr-rayeens-projects.vercel.app/",
		// 	process.env.FRONTEND,
		// ],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
	})
);


app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req,res) => {
    res.status(200).send("Server is Running OK!");
})
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);



server.listen(PORT, () => {
    console.log("Server running on Port:" + PORT);
    connectDB();
})
