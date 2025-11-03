import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let readyUsers = new Set();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User clicks "Ready"
  socket.on("ready", () => {
    readyUsers.add(socket.id);
    console.log(`User ready: ${socket.id}`);
    io.emit("readyCount", readyUsers.size);
  });

  // User clicks "Play"
  socket.on("play", () => {
    console.log(`Play triggered by ${socket.id}`);
    // Only play for users marked as ready
    readyUsers.forEach((id) => {
      io.to(id).emit("playMusic");
    });
  });

  // User disconnects
  socket.on("disconnect", () => {
    readyUsers.delete(socket.id);
    io.emit("readyCount", readyUsers.size);
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 3000;
server.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
