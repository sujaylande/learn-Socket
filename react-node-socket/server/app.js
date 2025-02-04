import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const app = express();
// Create a http server using the express app

const httpServer = createServer(app);
// Create a new instance of socket.io by passing the http server object

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World");
});


io.on("connection", (socket) => {
  console.log("a user connected with id: ", socket.id);

  // Listen for message event
  socket.on("message", ({message, room}) => {
    // Broadcast the message to all the clients(becouse its io.)
    // io.emit("receive-message", message);

    // broadcast to all clients except the sender( because its socket.)
    // socket.broadcast.emit("receive-message", message);

    // broadcast to all clients in a specific room
    io.to(room).emit("receive-message", message);
  });

  socket.on("join-room-group", (room) => {
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});



// Start the server
httpServer.listen(8000, () => {
  console.log(`Server is running on http://localhost:8000`);
});
