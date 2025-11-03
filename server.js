const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

let clients = []; // connected clients via SSE

// ---- SSE connection ----
app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  clients.push(res);
  console.log("Client connected. Total:", clients.length);

  req.on("close", () => {
    clients = clients.filter(c => c !== res);
    console.log("Client disconnected. Total:", clients.length);
  });
});

// ---- Trigger endpoint ----
app.post("/play", (req, res) => {
  console.log("🎵 Broadcasting play event to all clients...");
  clients.forEach(client => client.write("event: play\ndata: {}\n\n"));
  res.json({ ok: true });
});

// ---- Serve frontend ----
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
