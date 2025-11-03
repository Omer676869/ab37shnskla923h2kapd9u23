import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("playMusic", () => {
    // Broadcast to everyone (including the sender)
    io.emit("playMusic");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
