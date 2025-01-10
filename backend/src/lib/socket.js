import {Server} from 'socket.io';
import http from "http";
import express from "express";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: [
			"http://localhost:5173",
			process.env.FRONTEND,
			"https://chatty-app-eta.vercel.app/",
        ],
        credentials: true,
    },
});


//used to store online users
let userSocketMap= { } //{userId:socketId}

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}



io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit() is user to send events to all the connected  clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })

})


export { io, app, server };