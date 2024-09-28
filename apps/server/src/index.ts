import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { whiteboardHandler } from "./events/whiteboardHandler";

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

const onConnection = (socket: Socket) => {
  console.log("[!] client connected:", socket.id);
  whiteboardHandler(io, socket);
};

io.on("connection", onConnection);

server.listen(3002, () => {
  console.log("\x1b[30mserver running at http://localhost:3000 \x1b[0m");
});
