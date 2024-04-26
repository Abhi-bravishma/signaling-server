const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.get('/',(req,res)=> {
  res.send("WebRCT server working")
})

const port = process.env.PORT || 2000
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your Angular app's origin
  },
});
const users = {};

// Event handler for new WebSocket connections
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('join-room', (roomId, userId) => {
//     console.log(socket.id, 'joining room', roomId);
//     if (!roomId || !userId) {
//       socket.emit('join-room-error', 'Invalid room ID or user ID');
//       return;
//     }

//     socket.join(roomId);
//     users[socket.id] = { id: userId, room: roomId };

//     // Broadcast user joined notification (if needed)
//     socket.broadcast.to(roomId).emit('user-joined', userId);
//   });

//   socket.on('offer', (offer, roomId) => {
//     console.log("offer",offer);
//     if (!roomId || !users[socket.id]) {
//       return; // Handle invalid offer or sender not in a room
//     }

//     const otherUser = Object.values(users).find(user => user.room === roomId && user.id !== users[socket.id].id);
//     if (!otherUser) {
//       return; // No other user in the room to receive the offer
//     }

//     socket.to(otherUser.id).emit('offer', offer);
//   });

//   socket.on('answer', (answer, roomId) => {
//     console.log('Received answer from', users[socket.id].id, 'in room', roomId);

//     if (!roomId || !users[socket.id]) {
//       console.error("Invalid answer or sender not in a room:", socket.id);
//       return;
//     }

//     const offerer = Object.values(users).find(user => user.room === roomId && user.id !== users[socket.id].id);
//     if (!offerer) {
//       console.error("No offerer in the room to receive the answer");
//       return;
//     }

//     io.to(offerer.id).emit('answer', answer);
//   });

//   socket.on('ice-candidate', (candidate, roomId) => {
//     console.log("candidate",candidate);
//     if (!roomId || !users[socket.id]) {
//       return; // Handle invalid candidate or sender not in a room
//     }

//     socket.broadcast.to(roomId).emit('ice-candidate', candidate);
//   });

//   socket.on('disconnect', () => {
//     const user = users[socket.id];
//     if (user) {
//       delete users[socket.id];

//       // Broadcast user left notification (if needed)
//       io.to(user.room).emit('user-left', user.id);
//     }
//   });

//   socket.on('error', (error) => {
//     console.error('Socket error:', error);
//   });
// });
io.on("connection", (socket) => {
  console.log("A user connected");
  const userId = socket.id;

  //storing user id in user object
  users[userId] = {
    socket: socket,
    username: `Peer ${Object.keys(users).length + 1}`, // Assign a default username
  };

  socket.on("disconnect", () => {
    console.log("User disconnected");
    delete users[userId];
  });

  socket.on("chat message", (msg) => {
    console.log("message: ", {
      sender: users[userId].username,
      message: msg,
    });
    // io.emit('chat message', msg);

    socket.broadcast.emit("chat message", {
      sender: users[userId].username,
      message: msg,
    });
  });
});

server.listen(port, () => {
  console.log("Signaling server is running on port 2000");
});
