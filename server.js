const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Optional: serve index.html explicitly (for safety in Vercel)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Keep track of connected clients
let activeClients = [];

io.on("connection", (socket) => {
  console.log("A user connected");
  activeClients.push(socket);

  socket.on("startMusic", () => {
    console.log("Broadcasting playMusic to all clients");
    activeClients.forEach((client) => {
      client.emit("playMusic");
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    activeClients = activeClients.filter((client) => client !== socket);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
