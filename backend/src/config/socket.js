import { Server } from "socket.io";
import prisma from "../../prisma/client.js";
import { decodeToken } from "../config/jwt.js";

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  // JWT authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const payload = decodeToken(token);
    if (!payload) return next(new Error("Authentication error"));

    socket.userId = payload.id;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    socket.on("joinRoom", async (matchId) => {
      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: { users: true },
      });

      if (!match || !match.users.some(u => u.id === socket.userId)) {
        socket.emit("error", "You are not part of this match.");
        return;
      }

      socket.join(`match_${matchId}`);
    });

    socket.on("sendMessage", async (data) => {
      const { matchId, content } = data;

      const match = await prisma.match.findUnique({
        where: { id: matchId },
        include: { users: true },
      });

      if (!match || !match.users.some(u => u.id === socket.userId)) {
        socket.emit("error", "You cannot send messages to this match.");
        return;
      }

      const message = await prisma.message.create({
        data: { matchId, senderId: socket.userId, content },
        include: { sender: { include: { profile: true } } },
      });

      io.to(`match_${matchId}`).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};
