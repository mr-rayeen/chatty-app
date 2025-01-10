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
		origin: [
			"http://localhost:5173",
			"https://chatty-app-eta.vercel.app/",
			process.env.FRONTEND,
		],
		credentials: true,
		methods: ["GET", "POST"],
		handlePreflightRequest: (req, res) => {
			res.writeHead(200, {
				"Access-Control-Allow-Origin": req.headers.origin,
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Methods":
					"GET, POST, PUT, DELETE, OPTIONS",
				"Access-Control-Allow-Headers":
					"Origin, X-Requested-With, Content-Type, Accept, Authorization",
			});
			res.end();
		},
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

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../frontend/dist")));

//     app.get("*", (req, res) => {
//         res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//     })
// }



server.listen(PORT, () => {
    console.log("Server running on Port:" + PORT);
    connectDB();
})
