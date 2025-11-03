const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the index.html file
app.use(express.static('public'));

// On connection, listen for events and broadcast to clients
let activeClients = [];

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Add the user to the active clients list
  activeClients.push(socket);

  // Handle when a user clicks the "Start Music" button
  socket.on('startMusic', () => {
    console.log('Start music for all clients');
    
    // Broadcast the music start event to all connected clients
    activeClients.forEach(client => {
      client.emit('playMusic');
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    
    // Remove user from active clients list
    activeClients = activeClients.filter(client => client !== socket);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
