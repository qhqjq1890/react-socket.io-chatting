import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log(`${socket.id} is connected`);

  socket.on("sendMessage", ({ Message }) => {
    const messageObject = {
      messagefromserver: Message,
      Id: socket.id,
    };
    io.emit("broadcastMessage", { messageObject });
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
