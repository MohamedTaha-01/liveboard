import express, { Request, Response } from "express";
import { createServer } from "node:http";
import cors from "cors";
import { Server } from "socket.io";
import Whiteboard from "./models/Whiteboard";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["OPTIONS", "GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let storage: Whiteboard[] = [];

io.on("connection", (socket) => {
  console.log("[!] client connected:", socket.id);

  socket.on("whiteboard_create", (callback: Function) => {
    const whiteboard = new Whiteboard();
    storage.push(whiteboard);
    socket.join(whiteboard.id);
    console.log("\x1b[35m[!] whiteboard created:", whiteboard.id, "\x1b[0m");

    callback({ status: 201, whiteboard });
  });

  socket.on("whiteboard_join", (id: string, callback: Function) => {
    const whiteboard = storage.find((wb) => wb.id === id);
    if (!whiteboard) return { status: 404, error: "Whiteboard not found" };
    socket.join(whiteboard.id);
    console.log("\x1b[35m[!] whiteboard joined:", id, "\x1b[0m");

    callback({
      status: 200,
      whiteboard,
    });
  });

  socket.on("whiteboard_draw", (id: string, line, callback: Function) => {
    console.group("\x1b[33m[!] received draw order: \x1b[0m");
    console.log("\x1b[30m- from socket:", socket.id, "\x1b[0m");
    console.log("\x1b[30m- at whiteboard:", id, "\x1b[0m");
    console.log("\x1b[30m- in room:", io.sockets.adapter.rooms, "\x1b[0m");
    console.groupEnd();

    socket.to(id).emit("client_whiteboard_draw", line);
    callback({
      status: 200,
    });
  });
});

server.listen(3002, () => {
  console.log("\x1b[30mserver running at http://localhost:3000 \x1b[0m");
});
