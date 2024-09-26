import express, { Request, Response } from "express";
import { createServer } from "node:http";
import cors from "cors";
import { Server } from "socket.io";

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

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);
});

server.listen(3002, () => {
  console.log("server running at http://localhost:3000");
});
