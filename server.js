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

// Serve static files from "public"
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("playMusic", () => {
    io.emit("playMusic");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
