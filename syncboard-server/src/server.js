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

const presence = new Map();

function announce(boardId) {
    const users = [...(presence.get(boardId)?.keys() ?? [])];
    io.to(`board:${boardId}`).emit("presence:update", users);
}

io.on("connection", (socket) => {
    socket.on("board:join", (boardId) => {
        if (typeof boardId !== "string" || !boardId.trim()) return;
        socket.join(`board:${boardId}`);
        console.log(`User ${socket.user.username} joined room: board:${boardId}`);

        const board = presence.get(boardId) ?? new Map();
        board.set(socket.user.username, (board.get(socket.user.username) ?? 0) + 1);
        presence.set(boardId, board);
        announce(boardId);
    });

    socket.on("disconnecting", () => {
        for (const room of socket.rooms) {
            if (!room.startsWith("board:")) continue;

            const id = room.slice("board:".length);
            const board = presence.get(id);
            if (!board) continue;

            const left = (board.get(socket.user.username) ?? 1) - 1;
            if (left > 0) board.set(socket.user.username, left);
            else board.delete(socket.user.username);

            announce(id);
        }
    });
});

await connectDB();

httpServer.listen(config.port, () => {
  console.log(`Syncboard Server running in ${config.env} mode on port ${config.port}...`);
});