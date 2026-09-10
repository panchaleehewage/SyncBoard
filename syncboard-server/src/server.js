import { createServer } from "node:http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import app from "./app.js";
import { config } from './config.js';
import { connectDB } from './db/connect.js';

const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: config.clientOrigin,
        credentials: true,
    },
});

app.set("io", io);

io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("NO_TOKEN"));
    try {
        const payload = jwt.verify(token, config.jwtSecret);
        socket.user = { id: payload.sub || payload.id, username: payload.username };
        next();
    } catch {
        next(new Error("BAD_TOKEN"));
    }
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.user.username);

    socket.on("board:join", (boardId) => {
        if (typeof boardId !== "string" || !boardId.trim()) return;
        socket.join(`board:${boardId}`);
        console.log(`User ${socket.user.username} joined room: board:${boardId}`);
    });
});

await connectDB();

httpServer.listen(config.port, () => {
  console.log(`Syncboard Server running in ${config.env} mode on port ${config.port}...`);
});